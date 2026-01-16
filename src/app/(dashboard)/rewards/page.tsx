"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Gift, Star, Crown, Award, Check, Lock, Loader2 } from "lucide-react";

interface Reward {
  id: string;
  name: string;
  description: string;
  type: string;
  pointsCost: number;
  badgeIcon: string | null;
  premiumDays: number | null;
  canClaim: boolean;
  alreadyClaimed: boolean;
}

interface RewardsData {
  rewards: Reward[];
  userPoints: number;
}

const rewardIcons: Record<string, any> = {
  PREMIUM_WEEK: Star,
  PREMIUM_MONTH: Star,
  PREMIUM_3MONTHS: Crown,
  PREMIUM_YEAR: Crown,
  BADGE: Award,
};

const rewardColors: Record<string, { bg: string; text: string; border: string }> = {
  PREMIUM_WEEK: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200" },
  PREMIUM_MONTH: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  PREMIUM_3MONTHS: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  PREMIUM_YEAR: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
  BADGE: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
};

export default function RewardsPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<RewardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchRewards();
    }
  }, [status]);

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const fetchRewards = async () => {
    try {
      const res = await fetch("/api/gamification/rewards");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (rewardId: string) => {
    setClaiming(rewardId);
    try {
      const res = await fetch("/api/gamification/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId }),
      });

      if (res.ok) {
        setSuccess(rewardId);
        // Refresh data
        fetchRewards();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la reclamation");
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Recompenses
        </h1>
        <p className="text-gray-600 mt-1">
          Echangez vos points contre des recompenses exclusives
        </p>
      </div>

      {/* Points balance */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-100">Vos points disponibles</p>
            <p className="text-4xl font-bold mt-1">{data?.userPoints || 0}</p>
          </div>
          <Gift className="h-16 w-16 text-white/20" />
        </div>
      </div>

      {/* Rewards grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.rewards.map((reward) => {
          const Icon = rewardIcons[reward.type] || Gift;
          const colors = rewardColors[reward.type] || rewardColors.BADGE;
          const isClaiming = claiming === reward.id;
          const isSuccess = success === reward.id;

          return (
            <div
              key={reward.id}
              className={`bg-white rounded-2xl border-2 ${
                reward.alreadyClaimed
                  ? "border-green-200 bg-green-50"
                  : reward.canClaim
                  ? colors.border
                  : "border-gray-200 opacity-75"
              } overflow-hidden transition-all hover:shadow-lg`}
            >
              {/* Header */}
              <div className={`${reward.alreadyClaimed ? "bg-green-100" : colors.bg} p-4`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-white shadow-sm`}>
                    {reward.alreadyClaimed ? (
                      <Check className="h-6 w-6 text-green-600" />
                    ) : (
                      <Icon className={`h-6 w-6 ${colors.text}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                    {reward.premiumDays && (
                      <p className="text-sm text-gray-600">
                        {reward.premiumDays} jours de Premium
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">{reward.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-gray-900">{reward.pointsCost}</span>
                    <span className="text-sm text-gray-500">points</span>
                  </div>

                  {reward.alreadyClaimed ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <Check className="h-4 w-4" />
                      Obtenu
                    </span>
                  ) : reward.canClaim ? (
                    <button
                      onClick={() => claimReward(reward.id)}
                      disabled={isClaiming}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        isSuccess
                          ? "bg-green-500 text-white"
                          : "bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-md"
                      }`}
                    >
                      {isClaiming ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isSuccess ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        "Reclamer"
                      )}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                      <Lock className="h-4 w-4" />
                      {(data?.userPoints || 0) < reward.pointsCost
                        ? `${reward.pointsCost - (data?.userPoints || 0)} pts manquants`
                        : "Indisponible"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {data?.rewards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune recompense disponible
          </h3>
          <p className="text-gray-500">
            Les recompenses seront bientot disponibles!
          </p>
        </div>
      )}

      {/* Info */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Comment ca marche ?</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-teal-500">•</span>
            Gagnez des points en signalant la disponibilite des medicaments
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500">•</span>
            Echangez vos points contre des semaines ou mois de Premium gratuit
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500">•</span>
            Les badges sont permanents et s'affichent sur votre profil
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500">•</span>
            Les recompenses Premium sont cumulables
          </li>
        </ul>
      </div>
    </div>
  );
}
