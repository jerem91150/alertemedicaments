import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLeaderboard, getOrCreateUserPoints } from "@/lib/gamification";
import prisma from "@/lib/prisma";

// GET /api/gamification/leaderboard - Obtenir le classement
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") || "weekly") as "weekly" | "monthly" | "allTime";
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    const session = await getServerSession(authOptions);

    // Obtenir le classement
    const leaderboard = await getLeaderboard(type, limit);

    // Si l'utilisateur est connecte, obtenir son rang
    let userRank = null;
    if (session?.user?.id) {
      const userPoints = await getOrCreateUserPoints(session.user.id);

      // Trouver le rang de l'utilisateur
      const userInLeaderboard = leaderboard.find(e => e.userId === session.user.id);

      if (userInLeaderboard) {
        userRank = {
          rank: userInLeaderboard.rank,
          points: userInLeaderboard.points,
          level: userInLeaderboard.level,
          streak: userInLeaderboard.streak,
          inTop: true,
        };
      } else {
        // Calculer le rang approximatif
        const pointsField = type === "weekly"
          ? userPoints.weeklyPoints
          : type === "monthly"
          ? userPoints.monthlyPoints
          : userPoints.totalPoints;

        // Compter combien d'utilisateurs ont plus de points
        const rankCount = await prisma.userPoints.count({
          where: {
            [type === "weekly" ? "weeklyPoints" : type === "monthly" ? "monthlyPoints" : "totalPoints"]: {
              gt: pointsField,
            },
          },
        });

        userRank = {
          rank: rankCount + 1,
          points: pointsField,
          level: userPoints.level,
          streak: userPoints.streak,
          inTop: false,
        };
      }
    }

    return NextResponse.json({
      type,
      leaderboard,
      userRank,
      topReward: type === "weekly" ? "Les 3 premiers gagnent 50 points bonus!" : null,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
