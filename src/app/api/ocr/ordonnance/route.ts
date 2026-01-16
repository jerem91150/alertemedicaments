import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// OCR temporairement désactivé en attendant la certification HDS
// La fonctionnalité sera réactivée une fois l'hébergement certifié HDS mis en place

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Fonctionnalité temporairement désactivée
    return NextResponse.json(
      {
        error: "Fonctionnalité bientôt disponible",
        message: "Le scan d'ordonnance sera disponible prochainement. Nous travaillons à mettre en place un hébergement certifié pour vos données de santé.",
        comingSoon: true
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Erreur traitement ordonnance:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Fonctionnalité temporairement désactivée
    return NextResponse.json(
      {
        ordonnances: [],
        message: "Le scan d'ordonnance sera disponible prochainement.",
        comingSoon: true
      }
    );
  } catch (error) {
    console.error("Erreur récupération ordonnances:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
