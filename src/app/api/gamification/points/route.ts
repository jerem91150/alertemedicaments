import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrCreateUserPoints, LEVELS_CONFIG, POINTS_CONFIG } from "@/lib/gamification";

// GET /api/gamification/points - Obtenir les points de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const userPoints = await getOrCreateUserPoints(session.user.id);

    // Calculer la progression vers le prochain niveau
    const levels = Object.entries(LEVELS_CONFIG);
    const currentLevelIndex = levels.findIndex(([key]) => key === userPoints.level);
    const nextLevel = levels[currentLevelIndex + 1];

    let progressToNextLevel = 100;
    let pointsToNextLevel = 0;

    if (nextLevel) {
      const currentLevelMin = LEVELS_CONFIG[userPoints.level as keyof typeof LEVELS_CONFIG].minPoints;
      const nextLevelMin = nextLevel[1].minPoints;
      const pointsInLevel = userPoints.totalPoints - currentLevelMin;
      const pointsNeeded = nextLevelMin - currentLevelMin;
      progressToNextLevel = Math.min(100, Math.round((pointsInLevel / pointsNeeded) * 100));
      pointsToNextLevel = nextLevelMin - userPoints.totalPoints;
    }

    return NextResponse.json({
      totalPoints: userPoints.totalPoints,
      weeklyPoints: userPoints.weeklyPoints,
      monthlyPoints: userPoints.monthlyPoints,
      level: userPoints.level,
      levelName: LEVELS_CONFIG[userPoints.level as keyof typeof LEVELS_CONFIG].name,
      streak: userPoints.streak,
      reportsCount: userPoints.reportsCount,
      verifiedCount: userPoints.verifiedCount,
      lastSignalAt: userPoints.lastSignalAt,
      progressToNextLevel,
      pointsToNextLevel,
      nextLevel: nextLevel ? {
        level: nextLevel[0],
        name: nextLevel[1].name,
        minPoints: nextLevel[1].minPoints,
      } : null,
      rewards: userPoints.rewards.map(r => ({
        id: r.id,
        name: r.reward.name,
        type: r.reward.type,
        claimedAt: r.claimedAt,
        expiresAt: r.expiresAt,
        isActive: r.isActive,
      })),
    });
  } catch (error) {
    console.error("Get points error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
