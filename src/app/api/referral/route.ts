import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";
import { authOptions } from "@/lib/auth";

// GET - Récupérer ou créer le code de parrainage de l'utilisateur connecté
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { referralCode: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Créer le code s'il n'existe pas encore
    let referralCode = user.referralCode;
    if (!referralCode) {
      referralCode = await prisma.referralCode.create({
        data: {
          userId: user.id,
          code: nanoid(8).toUpperCase(),
        },
      });
    }

    // Stats de parrainage
    const referrals = await prisma.referral.findMany({
      where: { referrerId: user.id },
      include: { referee: { select: { name: true, email: true, createdAt: true } } },
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      totalReferrals: referrals.length,
      completed: referrals.filter((r) => r.status === "COMPLETED" || r.status === "REWARDED").length,
      pending: referrals.filter((r) => r.status === "PENDING").length,
      premiumMonthsEarned: referrals.filter((r) => r.referrerRewarded).length,
    };

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://alertemedicaments.fr";

    return NextResponse.json({
      code: referralCode.code,
      url: `${baseUrl}?ref=${referralCode.code}`,
      stats,
      referrals: referrals.map((r) => ({
        id: r.id,
        refereeName: r.referee.name || r.referee.email?.split("@")[0],
        status: r.status,
        referrerRewarded: r.referrerRewarded,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error("Referral GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - Appliquer un code de parrainage (appelé lors de l'inscription d'un filleul)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, refereeUserId } = body;

    if (!referralCode || !refereeUserId) {
      return NextResponse.json(
        { error: "Code de parrainage et ID du filleul requis" },
        { status: 400 }
      );
    }

    // Trouver le code de parrainage
    const codeRecord = await prisma.referralCode.findUnique({
      where: { code: referralCode.toUpperCase() },
      include: { user: true },
    });

    if (!codeRecord) {
      return NextResponse.json({ error: "Code de parrainage invalide" }, { status: 400 });
    }

    // Pas d'auto-parrainage
    if (codeRecord.userId === refereeUserId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas utiliser votre propre code" },
        { status: 400 }
      );
    }

    // Vérifier que le filleul n'a pas déjà été parrainé
    const existingReferral = await prisma.referral.findUnique({
      where: { refereeId: refereeUserId },
    });

    if (existingReferral) {
      return NextResponse.json(
        { error: "Ce compte a déjà été parrainé" },
        { status: 409 }
      );
    }

    const now = new Date();
    const oneMonthLater = new Date(now);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    // Créer le referral et attribuer le Premium aux deux parties
    const [referral] = await prisma.$transaction([
      prisma.referral.create({
        data: {
          referralCodeId: codeRecord.id,
          referrerId: codeRecord.userId,
          refereeId: refereeUserId,
          status: "REWARDED",
          referrerRewarded: true,
          refereeRewarded: true,
          referrerPremiumUntil: oneMonthLater,
          refereePremiumUntil: oneMonthLater,
          completedAt: now,
        },
      }),
      // Filleul → Premium 1 mois
      prisma.user.update({
        where: { id: refereeUserId },
        data: { plan: "PREMIUM" },
      }),
      // Parrain → Premium 1 mois (ou extension si déjà Premium)
      prisma.user.update({
        where: { id: codeRecord.userId },
        data: { plan: "PREMIUM" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Parrainage activé ! 1 mois Premium offert pour vous et votre parrain 🎉",
      referral: {
        id: referral.id,
        premiumUntil: oneMonthLater,
      },
    });
  } catch (error) {
    console.error("Referral POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
