"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Store,
  ArrowLeft,
  Download,
  FileText,
  QrCode,
  Image as ImageIcon,
  Smartphone,
  Share2,
  Loader2,
  Check,
  ExternalLink,
} from "lucide-react";

interface PharmacyAccount {
  id: string;
  pharmacyName: string;
  pharmacy: {
    id: string;
  } | null;
}

const kitItems = [
  {
    id: "affiche-a4",
    name: "Affiche A4",
    description: "Affiche informative a imprimer et afficher en officine",
    icon: FileText,
    format: "PDF",
    size: "A4 (210x297mm)",
    color: "teal",
  },
  {
    id: "affiche-a3",
    name: "Affiche A3",
    description: "Grande affiche pour vitrine ou salle d'attente",
    icon: FileText,
    format: "PDF",
    size: "A3 (297x420mm)",
    color: "cyan",
  },
  {
    id: "sticker-qr",
    name: "Sticker QR Code",
    description: "Autocollant avec QR code pour acces rapide a l'app",
    icon: QrCode,
    format: "PDF",
    size: "10x10cm",
    color: "purple",
  },
  {
    id: "flyer",
    name: "Flyer patient",
    description: "Depliant a distribuer aux patients",
    icon: ImageIcon,
    format: "PDF",
    size: "A5 (148x210mm)",
    color: "orange",
  },
  {
    id: "carte-visite",
    name: "Carte de visite",
    description: "Mini carte avec QR code a glisser dans les sacs",
    icon: Share2,
    format: "PDF",
    size: "85x55mm",
    color: "green",
  },
];

export default function KitCommunicationPage() {
  const router = useRouter();
  const [account, setAccount] = useState<PharmacyAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string[]>([]);

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
    } catch (error) {
      router.push("/pharmacien/login");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (itemId: string) => {
    setDownloading(itemId);

    // Simuler un telechargement (en production, on genererait le PDF cote serveur)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Marquer comme telecharge
    setDownloaded((prev) => [...prev, itemId]);
    setDownloading(null);

    // Ouvrir le PDF (en production, on servirait le fichier depuis l'API)
    // window.open(`/api/pharmacien/kit/${itemId}?pharmacyId=${account?.pharmacy?.id}`, '_blank');
    alert(`Le fichier "${kitItems.find((k) => k.id === itemId)?.name}" sera telecharge.\n\nNote: Les fichiers PDF seront disponibles prochainement.`);
  };

  const handleDownloadAll = async () => {
    for (const item of kitItems) {
      if (!downloaded.includes(item.id)) {
        await handleDownload(item.id);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      teal: { bg: "bg-teal-100", text: "text-teal-600", border: "border-teal-200" },
      cyan: { bg: "bg-cyan-100", text: "text-cyan-600", border: "border-cyan-200" },
      purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
      orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
      green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
    };
    return colors[color] || colors.teal;
  };

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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/pharmacien/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Kit Communication</h1>
                <p className="text-sm text-gray-500">{account?.pharmacyName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Informez vos patients sur MediTrouve
          </h2>
          <p className="text-teal-100 mb-4">
            Telechargez ces supports pour aider vos patients a trouver rapidement
            les medicaments en rupture. Moins de questions, plus de satisfaction.
          </p>
          <button
            onClick={handleDownloadAll}
            disabled={downloading !== null}
            className="flex items-center gap-2 px-6 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Download className="h-5 w-5" />
            Tout telecharger
          </button>
        </div>

        {/* QR Code Preview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
              <QrCode className="h-16 w-16 text-gray-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                QR Code personnalise
              </h3>
              <p className="text-gray-600 mb-3">
                Tous les supports incluent un QR code qui redirige vers l'application.
                Les patients pourront scanner et telecharger l'app instantanement.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  iOS App Store
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  Google Play
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  Web App
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kit Items */}
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Supports disponibles
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {kitItems.map((item) => {
            const colors = getColorClasses(item.color);
            const isDownloading = downloading === item.id;
            const isDownloaded = downloaded.includes(item.id);
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border-2 ${colors.border} overflow-hidden hover:shadow-lg transition-all`}
              >
                <div className={`${colors.bg} p-4`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.format} • {item.size}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                  <button
                    onClick={() => handleDownload(item.id)}
                    disabled={isDownloading}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      isDownloaded
                        ? "bg-green-100 text-green-700"
                        : `${colors.bg} ${colors.text} hover:opacity-80`
                    }`}
                  >
                    {isDownloading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isDownloaded ? (
                      <>
                        <Check className="h-4 w-4" />
                        Telecharge
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Telecharger
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Conseils d'utilisation
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-teal-500 mt-1">•</span>
              <span>
                Placez l'affiche A4 pres du comptoir pour une visibilite maximale
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500 mt-1">•</span>
              <span>
                Collez le sticker QR code sur la vitrine pour les passants
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500 mt-1">•</span>
              <span>
                Distribuez les flyers aux patients qui demandent des medicaments en rupture
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500 mt-1">•</span>
              <span>
                Glissez une carte de visite dans les sacs lors des livraisons
              </span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="mt-8 text-center text-gray-500">
          <p>
            Besoin de supports personnalises ?{" "}
            <a
              href="mailto:contact@meditrouve.fr"
              className="text-teal-600 hover:underline"
            >
              Contactez-nous
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
