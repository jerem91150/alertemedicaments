"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Store,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Download,
  LogOut,
  Loader2,
  Package,
  TrendingUp,
  FileText,
  ChevronRight,
  X,
} from "lucide-react";

interface PharmacyAccount {
  id: string;
  email: string;
  pharmacyName: string;
  ownerName: string;
  pharmacy: {
    id: string;
    name: string;
    address: string;
    city: string;
  } | null;
}

interface Medication {
  id: string;
  cisCode: string;
  cip13: string | null;
  name: string;
  laboratory: string | null;
  activeIngredient: string | null;
  dosage: string | null;
  form: string | null;
  status: string;
  expectedReturn: string | null;
  isMITM: boolean;
  availableReports?: number;
}

interface MyReport {
  id: string;
  medication: Medication;
  status: string;
  quantity: number | null;
  price: number | null;
  verifiedBy: number;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
}

export default function PharmacienDashboard() {
  const router = useRouter();
  const [account, setAccount] = useState<PharmacyAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [ruptures, setRuptures] = useState<Medication[]>([]);
  const [myReports, setMyReports] = useState<MyReport[]>([]);
  const [stats, setStats] = useState({ rupture: 0, tension: 0, available: 0 });
  const [myStats, setMyStats] = useState({ total: 0, available: 0, limited: 0, expired: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ruptures" | "mes-signalements">("ruptures");
  const [showSignalModal, setShowSignalModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [signaling, setSignaling] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/pharmacien/auth");
      const data = await res.json();

      if (!data.authenticated) {
        router.push("/pharmacien/login");
        return;
      }

      setAccount(data.account);
      await Promise.all([fetchRuptures(), fetchMyReports()]);
    } catch (error) {
      router.push("/pharmacien/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchRuptures = async () => {
    try {
      const res = await fetch("/api/pharmacien/ruptures");
      if (res.ok) {
        const data = await res.json();
        setRuptures(data.ruptures);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching ruptures:", error);
    }
  };

  const fetchMyReports = async () => {
    try {
      const res = await fetch("/api/pharmacien/mes-signalements");
      if (res.ok) {
        const data = await res.json();
        setMyReports(data.reports);
        setMyStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching my reports:", error);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/pharmacien/auth", { method: "DELETE" });
    router.push("/pharmacien/login");
  };

  const openSignalModal = (medication: Medication) => {
    setSelectedMedication(medication);
    setShowSignalModal(true);
  };

  const submitSignal = async (status: string, quantity?: number) => {
    if (!selectedMedication) return;
    setSignaling(true);

    try {
      const res = await fetch("/api/pharmacien/ruptures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicationId: selectedMedication.id,
          status,
          quantity,
        }),
      });

      if (res.ok) {
        setShowSignalModal(false);
        setSelectedMedication(null);
        await Promise.all([fetchRuptures(), fetchMyReports()]);
      }
    } catch (error) {
      console.error("Error signaling:", error);
    } finally {
      setSignaling(false);
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm("Supprimer ce signalement ?")) return;

    try {
      const res = await fetch(`/api/pharmacien/ruptures?reportId=${reportId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchMyReports();
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const renewReports = async () => {
    const expiredIds = myReports.filter((r) => r.isExpired).map((r) => r.id);
    if (expiredIds.length === 0) return;

    try {
      const res = await fetch("/api/pharmacien/mes-signalements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportIds: expiredIds }),
      });

      if (res.ok) {
        await fetchMyReports();
      }
    } catch (error) {
      console.error("Error renewing reports:", error);
    }
  };

  const filteredRuptures = ruptures.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.activeIngredient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.cisCode.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">{account?.pharmacyName}</h1>
                <p className="text-sm text-gray-500">{account?.pharmacy?.address}, {account?.pharmacy?.city}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Deconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.rupture}</p>
                <p className="text-sm text-gray-500">Ruptures</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.tension}</p>
                <p className="text-sm text-gray-500">Tensions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{myStats.available}</p>
                <p className="text-sm text-gray-500">Mes disponibles</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{myStats.total}</p>
                <p className="text-sm text-gray-500">Total signales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Kit Banner */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Kit Communication</h3>
                <p className="text-teal-100">Affiches et QR codes pour informer vos patients</p>
              </div>
            </div>
            <Link
              href="/pharmacien/kit-communication"
              className="flex items-center gap-2 px-6 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              <Download className="h-5 w-5" />
              Telecharger
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100 mb-6">
          <button
            onClick={() => setActiveTab("ruptures")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === "ruptures"
                ? "bg-teal-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Ruptures en cours ({stats.rupture + stats.tension})
            </span>
          </button>
          <button
            onClick={() => setActiveTab("mes-signalements")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === "mes-signalements"
                ? "bg-teal-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Package className="h-4 w-4" />
              Mes signalements ({myStats.total})
            </span>
          </button>
        </div>

        {activeTab === "ruptures" && (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un medicament en rupture..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Ruptures List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {filteredRuptures.length === 0 ? (
                <div className="p-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune rupture trouvee</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredRuptures.map((med) => (
                    <div key={med.id} className="p-4 hover:bg-gray-50 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                med.status === "RUPTURE"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {med.status === "RUPTURE" ? "Rupture" : "Tension"}
                            </span>
                            {med.isMITM && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                MITM
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 truncate">{med.name}</h3>
                          <p className="text-sm text-gray-500 truncate">
                            {med.laboratory} {med.dosage && `• ${med.dosage}`}
                          </p>
                          {med.availableReports && med.availableReports > 0 && (
                            <p className="text-sm text-green-600 mt-1">
                              {med.availableReports} pharmacie(s) l'ont en stock
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => openSignalModal(med)}
                          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all"
                        >
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline">J'en ai</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "mes-signalements" && (
          <>
            {/* Actions */}
            {myStats.expired > 0 && (
              <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <p className="text-yellow-800">
                  <span className="font-medium">{myStats.expired} signalement(s)</span> ont expire
                </p>
                <button
                  onClick={renewReports}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  Renouveler tous
                </button>
              </div>
            )}

            {/* My Reports List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {myReports.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Aucun signalement</p>
                  <button
                    onClick={() => setActiveTab("ruptures")}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all"
                  >
                    Signaler un medicament disponible
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {myReports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-4 ${report.isExpired ? "bg-gray-50 opacity-75" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                report.status === "AVAILABLE"
                                  ? "bg-green-100 text-green-700"
                                  : report.status === "LIMITED"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {report.status === "AVAILABLE"
                                ? "Disponible"
                                : report.status === "LIMITED"
                                ? "Stock limite"
                                : "Indisponible"}
                            </span>
                            {report.isExpired && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                Expire
                              </span>
                            )}
                            {report.verifiedBy > 0 && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {report.verifiedBy} verification(s)
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 truncate">
                            {report.medication.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {report.quantity && `${report.quantity} en stock • `}
                            Expire le {new Date(report.expiresAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Signal Modal */}
      {showSignalModal && selectedMedication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Signaler disponibilite</h3>
                <button
                  onClick={() => setShowSignalModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600 mt-1">{selectedMedication.name}</p>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={() => submitSignal("AVAILABLE")}
                disabled={signaling}
                className="w-full p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Disponible</p>
                    <p className="text-sm text-gray-500">Stock suffisant</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => submitSignal("LIMITED")}
                disabled={signaling}
                className="w-full p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl hover:bg-yellow-100 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Stock limite</p>
                    <p className="text-sm text-gray-500">Quelques unites seulement</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => submitSignal("UNAVAILABLE")}
                disabled={signaling}
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:bg-gray-100 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Indisponible aussi</p>
                    <p className="text-sm text-gray-500">Confirmer la rupture</p>
                  </div>
                </div>
              </button>
            </div>
            {signaling && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
