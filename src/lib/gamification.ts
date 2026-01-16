import prisma from "@/lib/prisma";
import { UserLevel } from "@prisma/client";

// Configuration des points
export const POINTS_CONFIG = {
  SIGNAL_AVAILABLE: 10,      // Signaler disponibilite
  SIGNAL_RUPTURE: 5,         // Signaler rupture
  SIGNAL_VERIFIED: 5,        // Bonus si verifie par autre user
  FIRST_OF_DAY: 3,           // Premier signalement du jour
  STREAK_7_DAYS: 20,         // Bonus streak 7 jours
  STREAK_30_DAYS: 100,       // Bonus streak 30 jours
  VERIFY_REPORT: 2,          // Verifier le signalement d'un autre
};

// Configuration des niveaux
export const LEVELS_CONFIG: Record<UserLevel, { minPoints: number; name: string }> = {
  NEWBIE: { minPoints: 0, name: "Debutant" },
  CONTRIBUTOR: { minPoints: 50, name: "Contributeur" },
  SUPER_CONTRIBUTOR: { minPoints: 200, name: "Super Contributeur" },
  AMBASSADOR: { minPoints: 500, name: "Ambassadeur" },
  LEGEND: { minPoints: 1000, name: "Legende" },
};

// Calculer le niveau en fonction des points
export function calculateLevel(points: number): UserLevel {
  if (points >= LEVELS_CONFIG.LEGEND.minPoints) return "LEGEND";
  if (points >= LEVELS_CONFIG.AMBASSADOR.minPoints) return "AMBASSADOR";
  if (points >= LEVELS_CONFIG.SUPER_CONTRIBUTOR.minPoints) return "SUPER_CONTRIBUTOR";
  if (points >= LEVELS_CONFIG.CONTRIBUTOR.minPoints) return "CONTRIBUTOR";
  return "NEWBIE";
}

// Obtenir ou creer les points d'un utilisateur
export async function getOrCreateUserPoints(userId: string) {
  let userPoints = await prisma.userPoints.findUnique({
    where: { userId },
    include: {
      rewards: {
        include: { reward: true },
        where: { isActive: true },
      },
    },
  });

  if (!userPoints) {
    userPoints = await prisma.userPoints.create({
      data: { userId },
      include: {
        rewards: {
          include: { reward: true },
          where: { isActive: true },
        },
      },
    });
  }

  return userPoints;
}

// Ajouter des points a un utilisateur
export async function addPoints(
  userId: string,
  points: number,
  reason: string
): Promise<{ totalPoints: number; levelUp: boolean; newLevel?: UserLevel }> {
  const userPoints = await getOrCreateUserPoints(userId);
  const newTotalPoints = userPoints.totalPoints + points;
  const newLevel = calculateLevel(newTotalPoints);
  const levelUp = newLevel !== userPoints.level;

  await prisma.userPoints.update({
    where: { userId },
    data: {
      totalPoints: newTotalPoints,
      weeklyPoints: { increment: points },
      monthlyPoints: { increment: points },
      level: newLevel,
    },
  });

  return {
    totalPoints: newTotalPoints,
    levelUp,
    newLevel: levelUp ? newLevel : undefined,
  };
}

// Traiter un signalement et attribuer les points
export async function processSignalPoints(
  userId: string,
  signalType: "AVAILABLE" | "UNAVAILABLE" | "LIMITED"
): Promise<{ pointsAwarded: number; breakdown: { reason: string; points: number }[] }> {
  const userPoints = await getOrCreateUserPoints(userId);
  const breakdown: { reason: string; points: number }[] = [];
  let totalPoints = 0;

  // Points de base selon le type
  const basePoints = signalType === "AVAILABLE"
    ? POINTS_CONFIG.SIGNAL_AVAILABLE
    : POINTS_CONFIG.SIGNAL_RUPTURE;

  breakdown.push({ reason: "Signalement", points: basePoints });
  totalPoints += basePoints;

  // Verifier si c'est le premier signalement du jour
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!userPoints.lastSignalAt || userPoints.lastSignalAt < today) {
    breakdown.push({ reason: "Premier du jour", points: POINTS_CONFIG.FIRST_OF_DAY });
    totalPoints += POINTS_CONFIG.FIRST_OF_DAY;
  }

  // Calculer le streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  let newStreak = 1;
  if (userPoints.lastSignalAt && userPoints.lastSignalAt >= yesterday) {
    newStreak = userPoints.streak + 1;

    // Bonus streak
    if (newStreak === 7) {
      breakdown.push({ reason: "Streak 7 jours!", points: POINTS_CONFIG.STREAK_7_DAYS });
      totalPoints += POINTS_CONFIG.STREAK_7_DAYS;
    } else if (newStreak === 30) {
      breakdown.push({ reason: "Streak 30 jours!", points: POINTS_CONFIG.STREAK_30_DAYS });
      totalPoints += POINTS_CONFIG.STREAK_30_DAYS;
    }
  }

  // Mettre a jour les points et le streak
  const newTotalPoints = userPoints.totalPoints + totalPoints;
  const newLevel = calculateLevel(newTotalPoints);

  await prisma.userPoints.update({
    where: { userId },
    data: {
      totalPoints: newTotalPoints,
      weeklyPoints: { increment: totalPoints },
      monthlyPoints: { increment: totalPoints },
      level: newLevel,
      streak: newStreak,
      lastSignalAt: new Date(),
      reportsCount: { increment: 1 },
    },
  });

  return { pointsAwarded: totalPoints, breakdown };
}

// Traiter une verification de signalement
export async function processVerifyPoints(userId: string): Promise<number> {
  const points = POINTS_CONFIG.VERIFY_REPORT;
  await addPoints(userId, points, "Verification de signalement");
  return points;
}

// Bonus quand un signalement est verifie par d'autres
export async function processSignalVerifiedBonus(reporterId: string): Promise<number> {
  const points = POINTS_CONFIG.SIGNAL_VERIFIED;

  await prisma.userPoints.update({
    where: { userId: reporterId },
    data: {
      totalPoints: { increment: points },
      weeklyPoints: { increment: points },
      monthlyPoints: { increment: points },
      verifiedCount: { increment: 1 },
    },
  });

  return points;
}

// Obtenir le classement
export async function getLeaderboard(
  type: "weekly" | "monthly" | "allTime" = "weekly",
  limit: number = 10
) {
  const orderBy = type === "weekly"
    ? { weeklyPoints: "desc" as const }
    : type === "monthly"
    ? { monthlyPoints: "desc" as const }
    : { totalPoints: "desc" as const };

  const leaderboard = await prisma.userPoints.findMany({
    take: limit,
    orderBy,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return leaderboard.map((entry, index) => ({
    rank: index + 1,
    userId: entry.userId,
    name: entry.user.name || entry.user.email.split("@")[0],
    points: type === "weekly"
      ? entry.weeklyPoints
      : type === "monthly"
      ? entry.monthlyPoints
      : entry.totalPoints,
    level: entry.level,
    streak: entry.streak,
  }));
}

// Reclamer une recompense
export async function claimReward(
  userId: string,
  rewardId: string
): Promise<{ success: boolean; error?: string; reward?: any }> {
  const userPoints = await getOrCreateUserPoints(userId);

  const reward = await prisma.reward.findUnique({
    where: { id: rewardId, isActive: true },
  });

  if (!reward) {
    return { success: false, error: "Recompense non trouvee" };
  }

  if (userPoints.totalPoints < reward.pointsCost) {
    return {
      success: false,
      error: `Points insuffisants (${userPoints.totalPoints}/${reward.pointsCost})`
    };
  }

  // Verifier si deja reclame (pour les badges)
  if (reward.type === "BADGE") {
    const existing = await prisma.userReward.findFirst({
      where: { userId, rewardId },
    });
    if (existing) {
      return { success: false, error: "Badge deja obtenu" };
    }
  }

  // Calculer l'expiration pour les recompenses premium
  let expiresAt: Date | null = null;
  if (reward.premiumDays) {
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + reward.premiumDays);
  }

  // Creer la recompense utilisateur et deduire les points
  const [userReward] = await prisma.$transaction([
    prisma.userReward.create({
      data: {
        userId,
        userPointsId: userPoints.id,
        rewardId,
        expiresAt,
      },
      include: { reward: true },
    }),
    prisma.userPoints.update({
      where: { userId },
      data: {
        totalPoints: { decrement: reward.pointsCost },
      },
    }),
  ]);

  // Si c'est du premium, mettre a jour le plan de l'utilisateur
  if (reward.premiumDays && reward.premiumDays > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { plan: "PREMIUM" },
    });
  }

  return { success: true, reward: userReward };
}

// Reset hebdomadaire des points (a appeler via cron)
export async function resetWeeklyPoints() {
  await prisma.userPoints.updateMany({
    data: { weeklyPoints: 0 },
  });
}

// Reset mensuel des points (a appeler via cron)
export async function resetMonthlyPoints() {
  await prisma.userPoints.updateMany({
    data: { monthlyPoints: 0 },
  });
}
