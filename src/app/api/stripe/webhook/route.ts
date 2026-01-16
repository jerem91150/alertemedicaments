// Webhook Stripe pour gérer les événements de paiement
import { NextRequest, NextResponse } from 'next/server';
import { stripe, isStripeConfigured, getPlanFromPriceId } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-log';
import Stripe from 'stripe';

// Désactiver le body parser pour recevoir le raw body
export const runtime = 'nodejs';

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;
  const plan = getPlanFromPriceId(priceId);

  if (!plan) {
    console.error('Unknown price ID:', priceId);
    return;
  }

  // Mettre à jour le plan de l'utilisateur
  await prisma.user.update({
    where: { id: userId },
    data: { plan },
  });

  await logAuditEvent({
    userId,
    action: 'SUBSCRIPTION_CREATED',
    resource: 'subscription',
    details: {
      plan,
      subscriptionId: subscription.id,
      priceId,
    },
  });

  console.log(`User ${userId} upgraded to ${plan}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  const priceId = subscription.items.data[0]?.price.id;
  const plan = getPlanFromPriceId(priceId);

  if (!plan) return;

  // Vérifier si l'abonnement est annulé
  if (subscription.cancel_at_period_end) {
    await logAuditEvent({
      userId,
      action: 'SUBSCRIPTION_CANCELLATION_SCHEDULED',
      resource: 'subscription',
      details: {
        cancelAt: subscription.cancel_at,
        subscriptionId: subscription.id,
      },
    });
    return;
  }

  // Mettre à jour le plan (changement de plan)
  await prisma.user.update({
    where: { id: userId },
    data: { plan },
  });

  await logAuditEvent({
    userId,
    action: 'SUBSCRIPTION_UPDATED',
    resource: 'subscription',
    details: {
      plan,
      subscriptionId: subscription.id,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  // Rétrograder au plan FREE
  await prisma.user.update({
    where: { id: userId },
    data: { plan: 'FREE' },
  });

  await logAuditEvent({
    userId,
    action: 'SUBSCRIPTION_CANCELLED',
    resource: 'subscription',
    details: {
      subscriptionId: subscription.id,
    },
  });

  console.log(`User ${userId} downgraded to FREE`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Trouver l'utilisateur par son customer ID
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) return;

  await logAuditEvent({
    userId: user.id,
    action: 'PAYMENT_FAILED',
    resource: 'subscription',
    details: {
      invoiceId: invoice.id,
      amount: invoice.amount_due,
    },
  });

  // TODO: Envoyer un email de relance
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier si Stripe est configuré
    if (!isStripeConfigured || !stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Vérifier la signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Traiter l'événement
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'checkout.session.completed':
        // Session de checkout complétée - l'abonnement sera créé
        console.log('Checkout completed:', event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
