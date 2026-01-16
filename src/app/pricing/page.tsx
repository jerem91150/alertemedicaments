'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Check, X, Zap, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PLANS, PlanId } from '@/lib/plans';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<PlanId | null>(null);

  const currentPlan = (session?.user as { plan?: PlanId })?.plan || 'FREE';

  const handleSubscribe = async (plan: PlanId) => {
    if (!session) {
      router.push('/login?redirect=/pricing');
      return;
    }

    if (plan === 'FREE') return;

    setLoading(plan);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billing }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur lors de la création du paiement');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erreur lors de la création du paiement');
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoading('PREMIUM');
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur');
      }
    } catch (error) {
      console.error('Portal error:', error);
    } finally {
      setLoading(null);
    }
  };

  const features = {
    FREE: [
      { name: 'Alertes de rupture illimitées', included: true },
      { name: 'Recherche de médicaments', included: true },
      { name: 'Localisation pharmacies', included: true },
      { name: '1 profil personnel', included: true },
      { name: '5 rappels de prise', included: true },
      { name: 'Scan d\'ordonnance (OCR) - Bientôt', included: false },
      { name: 'Prédictions de rupture IA', included: false },
      { name: 'Gestion de stock avancée', included: false },
      { name: 'Export de données', included: false },
      { name: 'Mode famille (5 profils)', included: false },
    ],
    PREMIUM: [
      { name: 'Alertes de rupture illimitées', included: true },
      { name: 'Recherche de médicaments', included: true },
      { name: 'Localisation pharmacies', included: true },
      { name: '1 profil personnel', included: true },
      { name: 'Rappels de prise illimités', included: true },
      { name: 'Scan d\'ordonnance (OCR) - Bientôt', included: true, highlight: true },
      { name: 'Prédictions de rupture IA', included: true, highlight: true },
      { name: 'Gestion de stock avancée', included: true, highlight: true },
      { name: 'Export de données (PDF, CSV)', included: true },
      { name: 'Mode famille (5 profils)', included: false },
    ],
    FAMILLE: [
      { name: 'Alertes de rupture illimitées', included: true },
      { name: 'Recherche de médicaments', included: true },
      { name: 'Localisation pharmacies', included: true },
      { name: 'Jusqu\'à 5 profils', included: true, highlight: true },
      { name: 'Rappels de prise illimités', included: true },
      { name: 'Scan d\'ordonnance (OCR) - Bientôt', included: true },
      { name: 'Prédictions de rupture IA', included: true },
      { name: 'Gestion de stock avancée', included: true },
      { name: 'Export de données (PDF, CSV)', included: true },
      { name: 'Partage avec aidants', included: true, highlight: true },
    ],
  };

  const planIcons: Record<PlanId, typeof Shield> = {
    FREE: Shield,
    PREMIUM: Zap,
    FAMILLE: Users,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Commencez gratuitement, passez à Premium quand vous êtes prêt.
            Aucun engagement, annulez à tout moment.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billing === 'monthly'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billing === 'yearly'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annuel
              <span className="ml-1 text-green-600 text-xs">-17%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {(['FREE', 'PREMIUM', 'FAMILLE'] as const).map((planId) => {
            const plan = PLANS[planId];
            const Icon = planIcons[planId];
            const isCurrentPlan = currentPlan === planId;
            const isPremium = planId === 'PREMIUM';

            const price = planId === 'FREE'
              ? 0
              : billing === 'yearly'
                ? (plan as typeof PLANS.PREMIUM).priceYearly
                : plan.price;

            const monthlyEquivalent = planId === 'FREE'
              ? 0
              : billing === 'yearly'
                ? ((plan as typeof PLANS.PREMIUM).priceYearly / 12).toFixed(2)
                : plan.price;

            return (
              <Card
                key={planId}
                className={`relative ${
                  isPremium
                    ? 'border-blue-500 border-2 shadow-xl scale-105'
                    : 'border-gray-200'
                }`}
              >
                {isPremium && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                      Populaire
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    isPremium ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${isPremium ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {price === 0 ? 'Gratuit' : `${price}€`}
                    </span>
                    {price > 0 && (
                      <span className="text-gray-500 ml-1">
                        /{billing === 'yearly' ? 'an' : 'mois'}
                      </span>
                    )}
                    {billing === 'yearly' && price > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        soit {monthlyEquivalent}€/mois
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 text-left">
                    {features[planId].map((feature, index) => (
                      <li
                        key={index}
                        className={`flex items-start gap-2 ${
                          'highlight' in feature && feature.highlight ? 'font-medium' : ''
                        }`}
                      >
                        {feature.included ? (
                          <Check className={`w-5 h-5 flex-shrink-0 ${
                            'highlight' in feature && feature.highlight ? 'text-green-600' : 'text-green-500'
                          }`} />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  {isCurrentPlan ? (
                    currentPlan === 'FREE' ? (
                      <Button className="w-full" variant="outline" disabled>
                        Plan actuel
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={handleManageSubscription}
                        disabled={loading !== null}
                      >
                        Gérer l'abonnement
                      </Button>
                    )
                  ) : planId === 'FREE' ? (
                    <Button className="w-full" variant="outline" disabled>
                      Plan de base
                    </Button>
                  ) : (
                    <Button
                      className={`w-full ${isPremium ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                      onClick={() => handleSubscribe(planId)}
                      disabled={loading !== null}
                    >
                      {loading === planId ? 'Chargement...' : `Passer à ${plan.name}`}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ / Trust signals */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Questions fréquentes
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Puis-je annuler à tout moment ?</h3>
              <p className="text-gray-600">
                Oui, vous pouvez annuler votre abonnement à tout moment. Vous conserverez
                l'accès jusqu'à la fin de votre période de facturation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Mes données sont-elles sécurisées ?</h3>
              <p className="text-gray-600">
                Absolument. Vos données sont chiffrées et nous sommes conformes au RGPD.
                Vous pouvez exporter ou supprimer vos données à tout moment.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Comment fonctionne le plan Famille ?</h3>
              <p className="text-gray-600">
                Vous pouvez créer jusqu'à 5 profils (parents, enfants...) et inviter des
                proches à suivre leurs médicaments avec vous.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Le plan gratuit est-il vraiment complet ?</h3>
              <p className="text-gray-600">
                Oui ! Les alertes de rupture sont illimitées. Le plan Premium ajoute des
                fonctionnalités avancées comme l'OCR et les prédictions IA.
              </p>
            </div>
          </div>
        </div>

        {/* Garantie */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Paiement sécurisé par Stripe. Satisfait ou remboursé pendant 14 jours.
          </p>
        </div>
      </div>
    </div>
  );
}
