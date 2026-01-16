// API Route pour créer une session de checkout Stripe
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, STRIPE_PRICES, getOrCreateStripeCustomer } from '@/lib/stripe';
import { z } from 'zod';
import { logAuditEvent } from '@/lib/audit-log';

const checkoutSchema = z.object({
  plan: z.enum(['PREMIUM', 'FAMILLE']),
  billing: z.enum(['monthly', 'yearly']),
});

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

    // Valider le body
    const body = await request.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { plan, billing } = validation.data;

    // Récupérer le price ID
    const priceId = STRIPE_PRICES[plan][billing];
    if (!priceId) {
      return NextResponse.json(
        { error: 'Prix non configuré' },
        { status: 500 }
      );
    }

    // Créer ou récupérer le customer Stripe
    const customerId = await getOrCreateStripeCustomer(
      session.user.id,
      session.user.email!,
      session.user.name
    );

    // URLs de redirection
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/dashboard?checkout=success&plan=${plan}`;
    const cancelUrl = `${baseUrl}/pricing?checkout=cancelled`;

    // Créer la session de checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: session.user.id,
        plan,
        billing,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          plan,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      locale: 'fr',
    });

    // Log de l'événement
    await logAuditEvent({
      userId: session.user.id,
      action: 'CHECKOUT_INITIATED',
      resource: 'subscription',
      details: { plan, billing, sessionId: checkoutSession.id },
    });

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
