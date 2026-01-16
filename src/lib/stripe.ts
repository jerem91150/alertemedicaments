// Configuration Stripe côté serveur
import Stripe from 'stripe';
import prisma from './prisma';

// Stripe est optionnel - ne pas crasher si non configuré
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  : null;

export const isStripeConfigured = !!stripe;

// Prix Stripe (à configurer dans le dashboard Stripe)
export const STRIPE_PRICES = {
  PREMIUM: {
    monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!,
  },
  FAMILLE: {
    monthly: process.env.STRIPE_FAMILLE_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_FAMILLE_YEARLY_PRICE_ID!,
  },
} as const;

// Mapping price ID -> plan
export function getPlanFromPriceId(priceId: string): 'PREMIUM' | 'FAMILLE' | null {
  if (
    priceId === STRIPE_PRICES.PREMIUM.monthly ||
    priceId === STRIPE_PRICES.PREMIUM.yearly
  ) {
    return 'PREMIUM';
  }
  if (
    priceId === STRIPE_PRICES.FAMILLE.monthly ||
    priceId === STRIPE_PRICES.FAMILLE.yearly
  ) {
    return 'FAMILLE';
  }
  return null;
}

// Créer ou récupérer un customer Stripe
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  // Vérifier si l'utilisateur a déjà un customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Créer un nouveau customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  });

  // Sauvegarder le customer ID
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

// Créer une session de checkout
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  return stripe.checkout.sessions.create({
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
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
    // Permettre les codes promo
    allow_promotion_codes: true,
    // Collecter l'adresse de facturation
    billing_address_collection: 'required',
    // Locale française
    locale: 'fr',
  });
}

// Créer un portal session pour gérer l'abonnement
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

// Annuler un abonnement
export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<Stripe.Subscription> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  if (immediately) {
    return stripe.subscriptions.cancel(subscriptionId);
  }

  // Annuler à la fin de la période
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

// Récupérer l'abonnement actif d'un customer
export async function getActiveSubscription(
  customerId: string
): Promise<Stripe.Subscription | null> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  return subscriptions.data[0] || null;
}
