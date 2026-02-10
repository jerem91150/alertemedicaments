/**
 * Côté client : applique le code de parrainage stocké après inscription.
 * À appeler après la création du compte (callback d'inscription).
 */
export async function applyStoredReferral(newUserId: string): Promise<boolean> {
  const code = localStorage.getItem("referral_code");
  const timestamp = localStorage.getItem("referral_timestamp");

  if (!code) return false;

  // Expire après 30 jours
  if (timestamp && Date.now() - parseInt(timestamp) > 30 * 24 * 60 * 60 * 1000) {
    localStorage.removeItem("referral_code");
    localStorage.removeItem("referral_timestamp");
    return false;
  }

  try {
    const res = await fetch("/api/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referralCode: code, refereeUserId: newUserId }),
    });

    if (res.ok) {
      localStorage.removeItem("referral_code");
      localStorage.removeItem("referral_timestamp");
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Côté serveur : applique le parrainage.
 * À appeler dans la route d'inscription si le code est fourni.
 */
export async function applyReferralServer(
  referralCode: string,
  refereeUserId: string,
  prisma: any
): Promise<{ success: boolean; message: string }> {
  const codeRecord = await prisma.referralCode.findUnique({
    where: { code: referralCode.toUpperCase() },
  });

  if (!codeRecord) return { success: false, message: "Code invalide" };
  if (codeRecord.userId === refereeUserId)
    return { success: false, message: "Auto-parrainage interdit" };

  const existing = await prisma.referral.findUnique({
    where: { refereeId: refereeUserId },
  });
  if (existing) return { success: false, message: "Déjà parrainé" };

  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  await prisma.$transaction([
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
        completedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: refereeUserId },
      data: { plan: "PREMIUM" },
    }),
    prisma.user.update({
      where: { id: codeRecord.userId },
      data: { plan: "PREMIUM" },
    }),
  ]);

  return { success: true, message: "1 mois Premium activé !" };
}
