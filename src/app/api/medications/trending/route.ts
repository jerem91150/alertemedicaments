import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MedicationStatus } from "@prisma/client";

interface TrendingMedication {
  id: string;
  name: string;
  cisCode: string;
  status: MedicationStatus;
  isMITM: boolean;
  searchCount: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // Recuperer les medicaments les plus recherches (basé sur SearchHistory)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    // Agreger les recherches par medicament
    const searchAggregation = await prisma.searchHistory.groupBy({
      by: ["query"],
      where: {
        createdAt: { gte: last7Days },
        results: { gt: 0 },
      },
      _count: {
        query: true,
      },
      orderBy: {
        _count: {
          query: "desc",
        },
      },
      take: 50,
    });

    // Rechercher les medicaments correspondants
    const trendingMedications: TrendingMedication[] = [];

    for (const search of searchAggregation) {
      const medication = await prisma.medication.findFirst({
        where: {
          OR: [
            { name: { contains: search.query, mode: "insensitive" } },
            { activeIngredient: { contains: search.query, mode: "insensitive" } },
            { cisCode: search.query },
          ],
        },
        select: {
          id: true,
          name: true,
          cisCode: true,
          status: true,
          isMITM: true,
        },
      });

      if (medication) {
        // Eviter les doublons
        if (!trendingMedications.find((m) => m.id === medication.id)) {
          trendingMedications.push({
            ...medication,
            searchCount: search._count.query,
          });
        }
      }

      if (trendingMedications.length >= limit) {
        break;
      }
    }

    // Si pas assez de resultats, completer avec les medicaments en rupture les plus importants
    if (trendingMedications.length < limit) {
      const rupturesMeds = await prisma.medication.findMany({
        where: {
          status: { in: ["RUPTURE", "TENSION"] },
          id: { notIn: trendingMedications.map((m) => m.id) },
        },
        select: {
          id: true,
          name: true,
          cisCode: true,
          status: true,
          isMITM: true,
        },
        orderBy: [
          { isMITM: "desc" },
          { status: "asc" }, // RUPTURE avant TENSION
        ],
        take: limit - trendingMedications.length,
      });

      for (const med of rupturesMeds) {
        trendingMedications.push({
          ...med,
          searchCount: 0,
        });
      }
    }

    return NextResponse.json({
      medications: trendingMedications.slice(0, limit),
    });
  } catch (error) {
    console.error("Trending error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
