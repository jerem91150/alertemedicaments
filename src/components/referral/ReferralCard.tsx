"use client";

import { useState, useEffect } from "react";
import { Gift, Copy, Check, Share2, Users, Crown } from "lucide-react";

interface ReferralStats {
  totalReferrals: number;
  completed: number;
  pending: number;
  premiumMonthsEarned: number;
}

interface ReferralData {
  code: string;
  url: string;
  stats: ReferralStats;
  referrals: {
    id: string;
    refereeName: string;
    status: string;
    referrerRewarded: boolean;
    createdAt: string;
  }[];
}

export default function ReferralCard() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/referral")
      .then((res) => {
        if (!res.ok) throw new Error("Non connecté");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const copyLink = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (!data) return;
    if (navigator.share) {
      await navigator.share({
        title: "AlerteMedicaments — Parrainage",
        text: "Rejoins AlerteMedicaments et profite d'1 mois Premium offert grâce à mon lien de parrainage !",
        url: data.url,
      });
    } else {
      copyLink();
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl bg-gray-100 p-6 h-48" />
    );
  }

  if (error) return null;
  if (!data) return null;

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Gift className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Parrainez vos proches</h3>
          <p className="text-sm text-gray-500">
            1 mois Premium offert pour vous et votre filleul
          </p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-lg border border-blue-200 bg-white px-4 py-2.5 font-mono text-sm text-gray-700 truncate">
          {data.url}
        </div>
        <button
          onClick={copyLink}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 transition-colors"
          title="Copier le lien"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        </button>
        <button
          onClick={shareLink}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          title="Partager"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {/* Code */}
      <p className="text-center text-xs text-gray-400">
        Votre code : <span className="font-bold text-blue-600">{data.code}</span>
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white/70 p-3 text-center">
          <Users className="mx-auto h-5 w-5 text-blue-500 mb-1" />
          <div className="text-lg font-bold text-gray-900">{data.stats.totalReferrals}</div>
          <div className="text-xs text-gray-500">Filleuls</div>
        </div>
        <div className="rounded-xl bg-white/70 p-3 text-center">
          <Check className="mx-auto h-5 w-5 text-green-500 mb-1" />
          <div className="text-lg font-bold text-gray-900">{data.stats.completed}</div>
          <div className="text-xs text-gray-500">Activés</div>
        </div>
        <div className="rounded-xl bg-white/70 p-3 text-center">
          <Crown className="mx-auto h-5 w-5 text-amber-500 mb-1" />
          <div className="text-lg font-bold text-gray-900">{data.stats.premiumMonthsEarned}</div>
          <div className="text-xs text-gray-500">Mois offerts</div>
        </div>
      </div>

      {/* Recent referrals */}
      {data.referrals.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Derniers parrainages</h4>
          {data.referrals.slice(0, 5).map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 text-sm"
            >
              <span className="text-gray-700">{r.refereeName}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  r.status === "REWARDED"
                    ? "bg-green-100 text-green-700"
                    : r.status === "COMPLETED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {r.status === "REWARDED"
                  ? "✅ Récompensé"
                  : r.status === "COMPLETED"
                  ? "Complété"
                  : "En attente"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
