// Guard pour vérifier les permissions utilisateur selon leur plan
// Utilisé dans les API routes et les composants

import { PlanId, PLAN_LIMITS, getPlanLimits, hasFeature, checkLimit } from './plans';

export type FeatureCheckResult = {
  allowed: boolean;
  reason?: string;
  upgradeRequired?: PlanId;
  currentLimit?: number;
  currentUsage?: number;
};

// Messages d'erreur personnalisés par feature
const FEATURE_MESSAGES: Record<string, { denied: string; upgrade: string }> = {
  maxProfiles: {
    denied: 'Vous avez atteint la limite de profils pour votre plan.',
    upgrade: 'Passez au plan Famille pour gérer jusqu\'à 5 profils.',
  },
  maxReminders: {
    denied: 'Vous avez atteint la limite de rappels pour votre plan.',
    upgrade: 'Passez au plan Premium pour des rappels illimités.',
  },
  maxFamilyInvites: {
    denied: 'Le partage famille n\'est pas disponible avec votre plan.',
    upgrade: 'Passez au plan Famille pour partager avec vos proches.',
  },
  hasOcr: {
    denied: 'La reconnaissance d\'ordonnance n\'est pas disponible avec votre plan.',
    upgrade: 'Passez au plan Premium pour scanner vos ordonnances.',
  },
  hasPredictions: {
    denied: 'Les prédictions de rupture ne sont pas disponibles avec votre plan.',
    upgrade: 'Passez au plan Premium pour anticiper les ruptures.',
  },
  hasDataExport: {
    denied: 'L\'export de données n\'est pas disponible avec votre plan.',
    upgrade: 'Passez au plan Premium pour exporter vos données.',
  },
  hasFullHistory: {
    denied: 'L\'historique complet n\'est pas disponible avec votre plan.',
    upgrade: 'Passez au plan Premium pour accéder à tout votre historique.',
  },
  hasFamilySharing: {
    denied: 'Le partage famille n\'est pas disponible avec votre plan.',
    upgrade: 'Passez au plan Famille pour partager avec vos proches.',
  },
  hasAdvancedReminders: {
    denied: 'La gestion de stock n\'est pas disponible avec votre plan.',
    upgrade: 'Passez au plan Premium pour gérer votre stock de médicaments.',
  },
};

// Vérifier si une feature boolean est accessible
export function checkFeatureAccess(
  userPlan: PlanId,
  feature: keyof typeof PLAN_LIMITS.FREE
): FeatureCheckResult {
  const allowed = hasFeature(userPlan, feature);

  if (allowed) {
    return { allowed: true };
  }

  const message = FEATURE_MESSAGES[feature];
  const suggestedPlan = getSuggestedUpgrade(feature);

  return {
    allowed: false,
    reason: message?.denied || 'Cette fonctionnalité n\'est pas disponible avec votre plan.',
    upgradeRequired: suggestedPlan,
  };
}

// Vérifier une limite numérique
export function checkLimitAccess(
  userPlan: PlanId,
  feature: keyof typeof PLAN_LIMITS.FREE,
  currentUsage: number
): FeatureCheckResult {
  const limits = getPlanLimits(userPlan);
  const limit = limits[feature];

  if (typeof limit !== 'number') {
    return { allowed: true };
  }

  // -1 = illimité
  if (limit === -1) {
    return { allowed: true };
  }

  const allowed = currentUsage < limit;

  if (allowed) {
    return {
      allowed: true,
      currentLimit: limit,
      currentUsage,
    };
  }

  const message = FEATURE_MESSAGES[feature];
  const suggestedPlan = getSuggestedUpgrade(feature);

  return {
    allowed: false,
    reason: message?.denied || 'Vous avez atteint la limite pour votre plan.',
    upgradeRequired: suggestedPlan,
    currentLimit: limit,
    currentUsage,
  };
}

// Suggérer le plan minimal pour une feature
function getSuggestedUpgrade(feature: keyof typeof PLAN_LIMITS.FREE): PlanId {
  // Features disponibles dès Premium
  const premiumFeatures = [
    'hasOcr',
    'hasPredictions',
    'hasDataExport',
    'hasFullHistory',
    'hasAdvancedReminders',
    'maxReminders',
  ];

  // Features uniquement dans Famille
  const familleFeatures = [
    'maxProfiles',
    'maxFamilyInvites',
    'hasFamilySharing',
  ];

  if (familleFeatures.includes(feature)) {
    return 'FAMILLE';
  }

  if (premiumFeatures.includes(feature)) {
    return 'PREMIUM';
  }

  return 'PREMIUM';
}

// Helper pour les API routes - retourne une Response si non autorisé
export function guardFeature(
  userPlan: PlanId,
  feature: keyof typeof PLAN_LIMITS.FREE
): Response | null {
  const check = checkFeatureAccess(userPlan, feature);

  if (check.allowed) {
    return null;
  }

  return new Response(
    JSON.stringify({
      error: check.reason,
      code: 'PLAN_LIMIT_EXCEEDED',
      upgradeRequired: check.upgradeRequired,
    }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// Helper pour les API routes - vérifier une limite
export function guardLimit(
  userPlan: PlanId,
  feature: keyof typeof PLAN_LIMITS.FREE,
  currentUsage: number
): Response | null {
  const check = checkLimitAccess(userPlan, feature, currentUsage);

  if (check.allowed) {
    return null;
  }

  return new Response(
    JSON.stringify({
      error: check.reason,
      code: 'PLAN_LIMIT_EXCEEDED',
      upgradeRequired: check.upgradeRequired,
      limit: check.currentLimit,
      current: check.currentUsage,
    }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// Type pour les composants React
export type PlanFeature = keyof typeof PLAN_LIMITS.FREE;

// Hook-friendly: retourne les infos pour afficher dans l'UI
export function getFeatureStatus(userPlan: PlanId, feature: PlanFeature) {
  const limits = getPlanLimits(userPlan);
  const value = limits[feature];
  const isBoolean = typeof value === 'boolean';
  const isNumber = typeof value === 'number';

  return {
    feature,
    enabled: isBoolean ? value : isNumber && value !== 0,
    limit: isNumber ? (value === -1 ? Infinity : value) : null,
    unlimited: isNumber && value === -1,
    upgradeRequired: !hasFeature(userPlan, feature) ? getSuggestedUpgrade(feature) : null,
  };
}
