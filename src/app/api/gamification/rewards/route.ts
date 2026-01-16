import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { claimReward, getOrCreateUserPoints } from "@/lib/gamification";

// GET /api/gamification/rewards - Obtenir les recompenses disponibles
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Obtenir toutes les recompenses actives
    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { pointsCost: "asc" },
    });

    // Si connecte, verifier quelles recompenses l'utilisateur peut reclamer
    let userPoints = null;
    let claimedRewards: string[] = [];

    if (session?.user?.id) {
      userPoints = await getOrCreateUserPoints(session.user.id);
      claimedRewards = userPoints.rewards.map(r => r.rewardId);
    }

    return NextResponse.json({
      rewards: rewards.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        type: r.type,
        pointsCost: r.pointsCost,
        badgeIcon: r.badgeIcon,
        premiumDays: r.premiumDays,
        canClaim: userPoints ? userPoints.totalPoints >= r.pointsCost : false,
        alreadyClaimed: claimedRewards.includes(r.id),
      })),
      userPoints: userPoints?.totalPoints || 0,
    });
  } catch (error) {
    console.error("Get rewards error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/gamification/rewards - Reclamer une recompense
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = await request.json();
    const { rewardId } = body;

    if (!rewardId) {
      return NextResponse.json({ error: "rewardId requis" }, { status: 400 });
    }

    const result = await claimReward(session.user.id, rewardId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      reward: result.reward,
      message: "Recompense reclamee avec succes!",
    });
  } catch (error) {
    console.error("Claim reward error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
