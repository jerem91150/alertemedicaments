import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * API Publique v1 pour integration logiciels de pharmacie
 *
 * Documentation:
 * - GET /api/v1/pharmacies/ruptures - Liste des ruptures actuelles
 * - POST /api/v1/pharmacies/signal - Signaler disponibilite
 * - GET /api/v1/pharmacies/search - Rechercher un medicament
 *
 * Authentification: API Key dans le header X-API-Key
 */

async function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get("X-API-Key");

  if (!apiKey) {
    return null;
  }

  const account = await prisma.pharmacyAccount.findUnique({
    where: { apiKey },
    include: { pharmacy: true },
  });

  if (!account || account.status !== "VERIFIED" || !account.apiEnabled) {
    return null;
  }

  return account;
}

// GET - Liste des medicaments en rupture/tension
export async function GET(request: NextRequest) {
  try {
    const account = await validateApiKey(request);

    if (!account) {
      return NextResponse.json(
        {
          error: "API Key invalide ou compte non autorise",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // RUPTURE, TENSION, or null for both
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search");

    const where: any = {
      status: status
        ? status as "RUPTURE" | "TENSION"
        : { in: ["RUPTURE", "TENSION"] },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { cisCode: { contains: search } },
        { cip13: { contains: search } },
        { activeIngredient: { contains: search, mode: "insensitive" } },
      ];
    }

    const [medications, total] = await Promise.all([
      prisma.medication.findMany({
        where,
        select: {
          id: true,
          cisCode: true,
          cip13: true,
          name: true,
          laboratory: true,
          activeIngredient: true,
          dosage: true,
          form: true,
          status: true,
          expectedReturn: true,
          lastChecked: true,
          isMITM: true,
        },
        orderBy: { lastChecked: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.medication.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: medications,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + medications.length < total,
      },
    });
  } catch (error) {
    console.error("API v1 GET error:", error);
    return NextResponse.json(
      { error: "Erreur serveur", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

// POST - Signaler disponibilite dans sa pharmacie
export async function POST(request: NextRequest) {
  try {
    const account = await validateApiKey(request);

    if (!account) {
      return NextResponse.json(
        {
          error: "API Key invalide ou compte non autorise",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    if (!account.pharmacyId) {
      return NextResponse.json(
        {
          error: "Pharmacie non configuree",
          code: "PHARMACY_NOT_CONFIGURED",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { medications } = body;

    if (!medications || !Array.isArray(medications)) {
      return NextResponse.json(
        {
          error: "Le champ 'medications' doit etre un tableau",
          code: "INVALID_REQUEST",
          example: {
            medications: [
              { cip13: "3400936000001", status: "AVAILABLE", quantity: 10 },
              { cisCode: "60000001", status: "LIMITED" },
            ],
          },
        },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    for (const med of medications) {
      try {
        // Trouver le medicament par CIP13 ou CIS
        let medication = null;

        if (med.cip13) {
          medication = await prisma.medication.findUnique({
            where: { cip13: med.cip13 },
          });
        } else if (med.cisCode) {
          medication = await prisma.medication.findUnique({
            where: { cisCode: med.cisCode },
          });
        }

        if (!medication) {
          errors.push({
            code: med.cip13 || med.cisCode,
            error: "Medicament non trouve",
          });
          continue;
        }

        // Creer ou mettre a jour le signalement
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const existingReport = await prisma.pharmacyReport.findFirst({
          where: {
            pharmacyId: account.pharmacyId,
            medicationId: medication.id,
            expiresAt: { gt: new Date() },
          },
        });

        const reportData = {
          status: med.status || "AVAILABLE",
          quantity: med.quantity || null,
          price: med.price || null,
          expiresAt,
        };

        let report;
        if (existingReport) {
          report = await prisma.pharmacyReport.update({
            where: { id: existingReport.id },
            data: reportData,
          });
        } else {
          report = await prisma.pharmacyReport.create({
            data: {
              pharmacyId: account.pharmacyId,
              medicationId: medication.id,
              userId: account.id,
              ...reportData,
            },
          });
        }

        results.push({
          code: med.cip13 || med.cisCode,
          medicationName: medication.name,
          status: reportData.status,
          reportId: report.id,
          expiresAt: report.expiresAt,
        });
      } catch (err) {
        errors.push({
          code: med.cip13 || med.cisCode,
          error: "Erreur de traitement",
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      errors: errors.length,
      results,
      ...(errors.length > 0 && { errorDetails: errors }),
    });
  } catch (error) {
    console.error("API v1 POST error:", error);
    return NextResponse.json(
      { error: "Erreur serveur", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
