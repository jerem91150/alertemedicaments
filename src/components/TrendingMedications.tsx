"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, AlertTriangle, Clock, ChevronRight, Loader2 } from "lucide-react";

interface TrendingMedication {
  id: string;
  name: string;
  cisCode: string;
  status: string;
  searchCount: number;
  isMITM: boolean;
}

export default function TrendingMedications() {
  const [medications, setMedications] = useState<TrendingMedication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await fetch("/api/medications/trending");
      if (res.ok) {
        const data = await res.json();
        setMedications(data.medications);
      }
    } catch (error) {
      console.error("Error fetching trending:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-teal-600" />
          <h3 className="font-bold text-gray-900">Les plus recherches</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        </div>
      </div>
    );
  }

  if (medications.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-teal-600" />
          <h3 className="font-bold text-gray-900">Les plus recherches</h3>
        </div>
        <Link
          href="/ruptures"
          className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
        >
          Voir tout
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-2">
        {medications.map((med, index) => (
          <Link
            key={med.id}
            href={`/medicament/${med.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${med.cisCode}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
          >
            <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-500 group-hover:bg-teal-100 group-hover:text-teal-600 transition-all">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate group-hover:text-teal-600 transition-all">
                {med.name}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium ${
                    med.status === "RUPTURE"
                      ? "text-red-600"
                      : med.status === "TENSION"
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}
                >
                  {med.status === "RUPTURE"
                    ? "Rupture"
                    : med.status === "TENSION"
                    ? "Tension"
                    : "Disponible"}
                </span>
                {med.isMITM && (
                  <span className="text-xs text-purple-600">MITM</span>
                )}
              </div>
            </div>
            {med.status === "RUPTURE" ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : med.status === "TENSION" ? (
              <Clock className="h-4 w-4 text-orange-500" />
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
