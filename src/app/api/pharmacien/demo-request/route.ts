import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Stocker les demandes de demo dans une table simple
// Pour l'instant on utilise un modele leger

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      pharmacyName,
      ownerName,
      email,
      phone,
      city,
      employeesCount,
      preferredTime,
      message,
    } = body;

    if (!pharmacyName || !ownerName || !email || !phone || !city) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent etre remplis" },
        { status: 400 }
      );
    }

    // Stocker dans les notifications ou creer un modele dedie
    // Pour l'instant, on log et on envoie un email

    const demoRequest = {
      pharmacyName,
      ownerName,
      email,
      phone,
      city,
      employeesCount,
      preferredTime,
      message,
      createdAt: new Date().toISOString(),
    };

    // Log pour le suivi
    console.log("=== NOUVELLE DEMANDE DE DEMO ===");
    console.log(JSON.stringify(demoRequest, null, 2));
    console.log("================================");

    // TODO: Envoyer un email de notification a l'equipe
    // TODO: Envoyer un email de confirmation au pharmacien
    // await sendEmail({ to: email, template: 'demo-confirmation', data: demoRequest });
    // await sendEmail({ to: 'commercial@meditrouve.fr', template: 'new-demo-request', data: demoRequest });

    return NextResponse.json({
      success: true,
      message: "Demande de demo enregistree",
    });
  } catch (error) {
    console.error("Demo request error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la demande" },
      { status: 500 }
    );
  }
}

// Recuperer les demandes de demo (pour l'admin)
export async function GET(request: NextRequest) {
  // TODO: Ajouter authentification admin
  return NextResponse.json({
    message: "Endpoint pour recuperer les demandes de demo (admin only)",
  });
}
