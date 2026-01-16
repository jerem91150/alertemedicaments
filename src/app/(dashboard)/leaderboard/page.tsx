"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Trophy, Medal, Flame, Crown, ChevronDown, Gift } from "lucide-react";
import Link from "next/link";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  points: number;
  level: string;
  streak: number;
}

interface LeaderboardData {
  type: "weekly" | "monthly" | "allTime";
  leaderboard: LeaderboardEntry[];
  userRank: {
    rank: number;
    points: number;
    level: string;
    streak: number;
    inTop: boolean;
  } | null;
  topReward: string | null;
}

const levelLabels: Record<string, string> = {
  NEWBIE: "Debutant",
  CONTRIBUTOR: "Contributeur",
  SUPER_CONTRIBUTOR: "Super Contributeur",
  AMBASSADOR: "Ambassadeur",
  LEGEND: "Legende",
};

const levelColors: Record<string, string> = {
  NEWBIE: "text-gray-500",
  CONTRIBUTOR: "text-teal-600",
  SUPER_CONTRIBUTOR: "text-purple-600",
  AMBASSADOR: "text-orange-600",
  LEGEND: "text-yellow-600",
};

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"weekly" | "monthly" | "allTime">("weekly");

  useEffect(() => {
    fetchLeaderboard();
  }, [type]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gamification/leaderboard?type=${type}&limit=20`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200";
    if (rank === 2) return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200";
    if (rank === 3) return "bg-gradient-to-r from-orange-50 to-amber-50 border-amber-200";
    return "bg-white border-gray-100";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Classement
          </h1>
          <p className="text-gray-600 mt-1">
            Les meilleurs contributeurs de la communaute
          </p>
        </div>
        <Link
          href="/rewards"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Gift className="h-4 w-4" />
          Recompenses
        </Link>
      </div>

      {/* Top reward banner */}
      {data?.topReward && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <p className="font-medium text-yellow-800">{data.topReward}</p>
          </div>
        </div>
      )}

      {/* Type selector */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
        {[
          { value: "weekly" as const, label: "Cette semaine" },
          { value: "monthly" as const, label: "Ce mois" },
          { value: "allTime" as const, label: "Tout temps" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setType(option.value)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              type === option.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* User rank (if not in top) */}
      {data?.userRank && !data.userRank.inTop && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-teal-700">#{data.userRank.rank}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Votre classement</p>
                <p className="text-sm text-gray-600">
                  {data.userRank.points} points • {levelLabels[data.userRank.level]}
                </p>
              </div>
            </div>
            {data.userRank.streak > 0 && (
              <div className="flex items-center gap-1 text-orange-600">
                <Flame className="h-4 w-4" />
                <span className="font-medium">{data.userRank.streak}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin mx-auto"></div>
          </div>
        ) : data?.leaderboard.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun classement pour le moment</p>
            <p className="text-sm text-gray-400 mt-2">
              Soyez le premier a signaler la disponibilite d'un medicament!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data?.leaderboard.map((entry, index) => {
              const isCurrentUser = session?.user?.id === entry.userId;
              return (
                <div
                  key={entry.userId}
                  className={`p-4 flex items-center gap-4 ${getRankBg(entry.rank)} ${
                    isCurrentUser ? "ring-2 ring-teal-500 ring-inset" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="w-10 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    {entry.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name & Level */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {entry.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                          Vous
                        </span>
                      )}
                    </p>
                    <p className={`text-sm ${levelColors[entry.level]}`}>
                      {levelLabels[entry.level]}
                    </p>
                  </div>

                  {/* Streak */}
                  {entry.streak > 0 && (
                    <div className="flex items-center gap-1 text-orange-500">
                      <Flame className="h-4 w-4" />
                      <span className="text-sm font-medium">{entry.streak}</span>
                    </div>
                  )}

                  {/* Points */}
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{entry.points}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* How to earn points */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Comment gagner des points ?</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 font-bold text-sm">
              +10
            </div>
            <div>
              <p className="font-medium text-gray-900">Signaler une disponibilite</p>
              <p className="text-sm text-gray-500">Indiquez qu'un medicament est disponible</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-sm">
              +5
            </div>
            <div>
              <p className="font-medium text-gray-900">Signalement verifie</p>
              <p className="text-sm text-gray-500">Bonus si d'autres confirment</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">
              +20
            </div>
            <div>
              <p className="font-medium text-gray-900">Streak 7 jours</p>
              <p className="text-sm text-gray-500">Signalez chaque jour pendant une semaine</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
              +2
            </div>
            <div>
              <p className="font-medium text-gray-900">Verifier un signalement</p>
              <p className="text-sm text-gray-500">Confirmez les signalements des autres</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
