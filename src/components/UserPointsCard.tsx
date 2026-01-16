"use client";

import { useEffect, useState } from "react";
import { Trophy, Flame, Star, Award, ChevronRight, Target } from "lucide-react";
import Link from "next/link";

interface UserPointsData {
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  level: string;
  levelName: string;
  streak: number;
  reportsCount: number;
  verifiedCount: number;
  progressToNextLevel: number;
  pointsToNextLevel: number;
  nextLevel: {
    level: string;
    name: string;
    minPoints: number;
  } | null;
  rewards: {
    id: string;
    name: string;
    type: string;
  }[];
}

const levelColors: Record<string, { bg: string; text: string; border: string }> = {
  NEWBIE: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" },
  CONTRIBUTOR: { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-300" },
  SUPER_CONTRIBUTOR: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  AMBASSADOR: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  LEGEND: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
};

export default function UserPointsCard() {
  const [points, setPoints] = useState<UserPointsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const res = await fetch("/api/gamification/points");
      if (res.ok) {
        const data = await res.json();
        setPoints(data);
      }
    } catch (error) {
      console.error("Error fetching points:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (!points) {
    return null;
  }

  const levelStyle = levelColors[points.level] || levelColors.NEWBIE;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header avec niveau */}
      <div className={`${levelStyle.bg} p-4 border-b ${levelStyle.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-white shadow-sm`}>
              <Trophy className={`h-6 w-6 ${levelStyle.text}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Niveau</p>
              <p className={`font-bold ${levelStyle.text}`}>{points.levelName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{points.totalPoints}</p>
            <p className="text-xs text-gray-500">points</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-bold text-gray-900">{points.streak}</span>
            </div>
            <p className="text-xs text-gray-500">Streak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-teal-500" />
              <span className="font-bold text-gray-900">{points.reportsCount}</span>
            </div>
            <p className="text-xs text-gray-500">Signalements</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="h-4 w-4 text-purple-500" />
              <span className="font-bold text-gray-900">{points.verifiedCount}</span>
            </div>
            <p className="text-xs text-gray-500">Verifies</p>
          </div>
        </div>

        {/* Progress to next level */}
        {points.nextLevel && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Prochain niveau</span>
              <span className="font-medium text-gray-900">
                {points.pointsToNextLevel} pts restants
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${points.progressToNextLevel}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              → {points.nextLevel.name}
            </p>
          </div>
        )}

        {/* Weekly points */}
        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Cette semaine</span>
          </div>
          <span className="font-semibold text-gray-900">{points.weeklyPoints} pts</span>
        </div>

        {/* Link to leaderboard */}
        <Link
          href="/leaderboard"
          className="flex items-center justify-between py-3 border-t border-gray-100 text-teal-600 hover:text-teal-700 transition-colors"
        >
          <span className="text-sm font-medium">Voir le classement</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
