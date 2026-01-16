"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Users,
  Gift,
  Copy,
  Check,
  Share2,
  Star,
  Crown,
  Award,
  Loader2,
  ChevronRight,
} from "lucide-react";
import SocialShare from "@/components/SocialShare";

interface ReferralData {
  referralCode: string;
  referralUrl: string;
  stats: {
    totalReferrals: number;
    pointsEarned: number;
    pointsPerReferral: number;
  };
  rewards: {
    referrals: number;
    reward: string;
    achieved: boolean;
  }[];
}

export default function ParrainagePage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchReferralData();
    }
  }, [status]);

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const fetchReferralData = async () => {
    try {
      const res = await fetch("/api/referral");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyUrl = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
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
          Parrainage
        </h1>
        <p className="text-gray-600 mt-1">
          Invitez vos proches et gagnez des points ensemble
        </p>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 rounded-2xl">
            <Gift className="h-12 w-12" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">
              Gagnez 50 points par parrainage !
            </h2>
            <p className="text-purple-100">
              Votre filleul recoit aussi 25 points bonus a son inscription
            </p>
          </div>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Votre code de parrainage</h3>

        {/* Code */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-gray-100 rounded-xl p-4 font-mono text-xl font-bold text-center tracking-widest">
            {data?.referralCode}
          </div>
          <button
            onClick={handleCopyCode}
            className={`p-4 rounded-xl transition-all ${
              copied
                ? "bg-green-100 text-green-600"
                : "bg-teal-500 text-white hover:bg-teal-600"
            }`}
          >
            {copied ? <Check className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
          </button>
        </div>

        {/* URL */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">
            Ou partagez directement ce lien :
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={data?.referralUrl || ""}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm text-gray-600"
            />
            <button
              onClick={handleCopyUrl}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-3">Partager via :</p>
          <SocialShare
            title="Rejoignez MediTrouve"
            text={`Utilisez mon code ${data?.referralCode} pour gagner 25 points bonus sur MediTrouve !`}
            url={data?.referralUrl}
            variant="icons"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">
            {data?.stats.totalReferrals || 0}
          </p>
          <p className="text-sm text-gray-500">Filleuls</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">
            {data?.stats.pointsEarned || 0}
          </p>
          <p className="text-sm text-gray-500">Points gagnes</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <Gift className="h-8 w-8 text-teal-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">
            +{data?.stats.pointsPerReferral || 50}
          </p>
          <p className="text-sm text-gray-500">Par parrainage</p>
        </div>
      </div>

      {/* Rewards Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Paliers de recompenses</h3>
        <div className="space-y-4">
          {data?.rewards.map((reward, index) => {
            const progress = Math.min(
              ((data.stats.totalReferrals || 0) / reward.referrals) * 100,
              100
            );
            const icons = [Star, Gift, Crown, Award];
            const Icon = icons[index] || Gift;

            return (
              <div key={index} className="relative">
                <div
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                    reward.achieved
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      reward.achieved ? "bg-green-100" : "bg-gray-200"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        reward.achieved ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">
                        {reward.referrals} parrainage{reward.referrals > 1 ? "s" : ""}
                      </p>
                      <span
                        className={`text-sm font-medium ${
                          reward.achieved ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {reward.reward}
                      </span>
                    </div>
                    {!reward.achieved && (
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {reward.achieved && (
                    <Check className="h-6 w-6 text-green-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Comment ca marche ?</h3>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            <span className="text-gray-600">
              Partagez votre code ou lien avec vos proches
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-sm font-bold">
              2
            </span>
            <span className="text-gray-600">
              Ils s'inscrivent avec votre code et recoivent 25 points bonus
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            <span className="text-gray-600">
              Vous recevez 50 points des que leur compte est valide
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-sm font-bold">
              4
            </span>
            <span className="text-gray-600">
              Debloquez des recompenses en parrainant plus d'amis !
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}
