import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { processSignalPoints } from "@/lib/gamification";

// Signaler la disponibilité d'un médicament dans une pharmacie
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Connexion requise pour signaler" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const body = await request.json();
    const { pharmacyId, medicationId, status, quantity, price } = body;

    if (!pharmacyId || !medicationId || !status) {
      return NextResponse.json(
        { error: "pharmacyId, medicationId et status requis" },
        { status: 400 }
      );
    }

    // Vérifier que la pharmacie et le médicament existent
    const [pharmacy, medication] = await Promise.all([
      prisma.pharmacy.findUnique({ where: { id: pharmacyId } }),
      prisma.medication.findUnique({ where: { id: medicationId } }),
    ]);

    if (!pharmacy) {
      return NextResponse.json({ error: "Pharmacie non trouvée" }, { status: 404 });
    }

    if (!medication) {
      return NextResponse.json({ error: "Médicament non trouvé" }, { status: 404 });
    }

    // Créer le signalement (expire dans 24h)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const report = await prisma.pharmacyReport.create({
      data: {
        pharmacyId,
        medicationId,
        userId: user.id,
        status,
        quantity: quantity || null,
        price: price || null,
        expiresAt,
      },
      include: {
        pharmacy: true,
        medication: true,
      },
    });

    // Attribuer les points de gamification
    const pointsResult = await processSignalPoints(user.id, status);

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        pharmacy: report.pharmacy.name,
        medication: report.medication.name,
        status: report.status,
        expiresAt: report.expiresAt,
      },
      points: {
        awarded: pointsResult.pointsAwarded,
        breakdown: pointsResult.breakdown,
      },
    });
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json(
      { error: "Erreur lors du signalement" },
      { status: 500 }
    );
  }
}

// Vérifier/confirmer un signalement existant
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Connexion requise" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const body = await request.json();
    const { reportId, confirm } = body;

    if (!reportId) {
      return NextResponse.json({ error: "reportId requis" }, { status: 400 });
    }

    const report = await prisma.pharmacyReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json({ error: "Signalement non trouvé" }, { status: 404 });
    }

    // Ne pas permettre de verifier son propre signalement
    if (report.userId === user.id) {
      return NextResponse.json({ error: "Vous ne pouvez pas verifier votre propre signalement" }, { status: 400 });
    }

    // Incrémenter le compteur de vérifications
    const updated = await prisma.pharmacyReport.update({
      where: { id: reportId },
      data: {
        verifiedBy: { increment: 1 },
        verifiedAt: new Date(),
      },
    });

    // Attribuer des points au verificateur
    const { processVerifyPoints, processSignalVerifiedBonus } = await import("@/lib/gamification");
    const verifyPoints = await processVerifyPoints(user.id);

    // Bonus pour le createur du signalement si c'est la premiere verification
    let reporterBonus = 0;
    if (updated.verifiedBy === 1) {
      reporterBonus = await processSignalVerifiedBonus(report.userId);
    }

    return NextResponse.json({
      success: true,
      verifiedBy: updated.verifiedBy,
      points: {
        awarded: verifyPoints,
        message: `+${verifyPoints} points pour la verification!`,
      },
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}

// Récupérer les signalements récents pour un médicament
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const medicationId = searchParams.get("medicationId");

    if (!medicationId) {
      return NextResponse.json({ error: "medicationId requis" }, { status: 400 });
    }

    const reports = await prisma.pharmacyReport.findMany({
      where: {
        medicationId,
        expiresAt: { gt: new Date() },
      },
      include: {
        pharmacy: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            postalCode: true,
            phone: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      reports: reports.map((r) => ({
        id: r.id,
        pharmacy: r.pharmacy,
        status: r.status,
        quantity: r.quantity,
        price: r.price,
        reportedAt: r.createdAt,
        verifiedBy: r.verifiedBy,
        expiresAt: r.expiresAt,
      })),
      total: reports.length,
    });
  } catch (error) {
    console.error("Get reports error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}
