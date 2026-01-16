import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// GET - Recuperer le code de parrainage de l'utilisateur
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non connecte" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        points: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouve" }, { status: 404 });
    }

    // Generer un code de parrainage base sur l'ID utilisateur
    const referralCode = generateReferralCode(user.id);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://meditrouve.fr";
    const referralUrl = `${baseUrl}/inscription?ref=${referralCode}`;

    // Compter les parrainages (utilisateurs avec ce code de reference)
    // Note: Necessiterait un champ referredBy dans le modele User
    const referralCount = 0; // TODO: Implementer le tracking

    // Points bonus pour les parrainages
    const referralPoints = {
      perReferral: 50, // Points gagnes par parrainage
      totalEarned: referralCount * 50,
    };

    return NextResponse.json({
      referralCode,
      referralUrl,
      stats: {
        totalReferrals: referralCount,
        pointsEarned: referralPoints.totalEarned,
        pointsPerReferral: referralPoints.perReferral,
      },
      rewards: [
        {
          referrals: 1,
          reward: "+50 points",
          achieved: referralCount >= 1,
        },
        {
          referrals: 5,
          reward: "+100 points bonus",
          achieved: referralCount >= 5,
        },
        {
          referrals: 10,
          reward: "1 mois Premium gratuit",
          achieved: referralCount >= 10,
        },
        {
          referrals: 25,
          reward: "Badge Ambassadeur",
          achieved: referralCount >= 25,
        },
      ],
    });
  } catch (error) {
    console.error("Referral GET error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST - Valider un code de parrainage lors de l'inscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, newUserId } = body;

    if (!referralCode || !newUserId) {
      return NextResponse.json(
        { error: "Code de parrainage et ID utilisateur requis" },
        { status: 400 }
      );
    }

    // Decoder le code de parrainage pour trouver le parrain
    const referrerId = decodeReferralCode(referralCode);

    if (!referrerId) {
      return NextResponse.json(
        { error: "Code de parrainage invalide" },
        { status: 400 }
      );
    }

    // Verifier que le parrain existe
    const referrer = await prisma.user.findUnique({
      where: { id: referrerId },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: "Parrain non trouve" },
        { status: 404 }
      );
    }

    // Verifier que l'utilisateur ne se parraine pas lui-meme
    if (referrerId === newUserId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas vous parrainer vous-meme" },
        { status: 400 }
      );
    }

    // TODO: Enregistrer le lien de parrainage
    // await prisma.user.update({
    //   where: { id: newUserId },
    //   data: { referredBy: referrerId },
    // });

    // Attribuer les points au parrain
    const { addPoints } = await import("@/lib/gamification");
    await addPoints(referrerId, 50, "REFERRAL");

    // Attribuer des points bonus au filleul
    await addPoints(newUserId, 25, "REFERRAL_BONUS");

    return NextResponse.json({
      success: true,
      message: "Parrainage valide !",
      referrerPoints: 50,
      newUserPoints: 25,
    });
  } catch (error) {
    console.error("Referral POST error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Fonctions utilitaires pour les codes de parrainage
function generateReferralCode(userId: string): string {
  // Creer un code court et unique base sur l'ID
  const hash = crypto
    .createHash("sha256")
    .update(userId + "meditrouve-referral")
    .digest("hex")
    .substring(0, 8)
    .toUpperCase();

  return `MT${hash}`;
}

function decodeReferralCode(code: string): string | null {
  // Note: Cette implementation simple ne permet pas de decoder directement
  // En production, on stockerait le code dans la base de donnees
  // Pour l'instant, on retourne null et on cherchera par code stocke
  return null;
}
