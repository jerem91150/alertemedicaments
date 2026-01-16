// API Route pour créer une session du portal client Stripe
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createPortalSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-log';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer le customer ID de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Aucun abonnement trouvé' },
        { status: 404 }
      );
    }

    // URL de retour
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/dashboard/profile`;

    // Créer la session portal
    const portalSession = await createPortalSession(
      user.stripeCustomerId,
      returnUrl
    );

    // Log de l'événement
    await logAuditEvent({
      userId: session.user.id,
      action: 'PORTAL_ACCESSED',
      resource: 'subscription',
      details: { sessionId: portalSession.id },
    });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error('Stripe portal error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'accès au portal' },
      { status: 500 }
    );
  }
}
