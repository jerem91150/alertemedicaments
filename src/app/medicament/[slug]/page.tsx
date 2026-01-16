import { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  MapPin,
  Bell,
  ChevronRight,
  Building,
  Pill,
  Calendar,
  ExternalLink,
  Share2,
  ArrowLeft,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic'; // Ne pas pre-rendre au build

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generer les metadonnees SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cisCode = slug.split("-").pop() || slug;

  const medication = await prisma.medication.findFirst({
    where: {
      OR: [
        { cisCode },
        { cip13: cisCode },
        { name: { contains: slug.replace(/-/g, " "), mode: "insensitive" } },
      ],
    },
  });

  if (!medication) {
    return {
      title: "Medicament non trouve - MediTrouve",
    };
  }

  const statusText =
    medication.status === "RUPTURE"
      ? "en rupture de stock"
      : medication.status === "TENSION"
      ? "en tension d'approvisionnement"
      : "disponible";

  return {
    title: `${medication.name} ${statusText} - Ou le trouver ? | MediTrouve`,
    description: `${medication.name} est actuellement ${statusText}. Trouvez les pharmacies qui l'ont en stock pres de chez vous avec MediTrouve. Alertes en temps reel et carte des disponibilites.`,
    keywords: [
      medication.name,
      medication.activeIngredient || "",
      "rupture",
      "penurie",
      "medicament",
      "pharmacie",
      "disponibilite",
      medication.laboratory || "",
    ].filter(Boolean),
    openGraph: {
      title: `${medication.name} - ${statusText}`,
      description: `Trouvez ${medication.name} dans les pharmacies pres de chez vous`,
      type: "website",
    },
  };
}

// Generer les pages statiques pour les medicaments en rupture
export async function generateStaticParams() {
  try {
    const medications = await prisma.medication.findMany({
      where: {
        status: { in: ["RUPTURE", "TENSION"] },
      },
      select: {
        cisCode: true,
        name: true,
      },
      take: 100,
    });

    return medications.map((med) => ({
      slug: `${med.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${med.cisCode}`,
    }));
  } catch (error) {
    // Database not available during build - use dynamic rendering
    console.warn("Database not available for generateStaticParams:", error);
    return [];
  }
}

export default async function MedicamentPage({ params }: PageProps) {
  const { slug } = await params;
  const cisCode = slug.split("-").pop() || slug;

  const medication = await prisma.medication.findFirst({
    where: {
      OR: [
        { cisCode },
        { cip13: cisCode },
        { name: { contains: slug.replace(/-/g, " "), mode: "insensitive" } },
      ],
    },
    include: {
      statusHistory: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!medication) {
    notFound();
  }

  // Recuperer les signalements de disponibilite
  const reports = await prisma.pharmacyReport.findMany({
    where: {
      medicationId: medication.id,
      status: "AVAILABLE",
      expiresAt: { gt: new Date() },
    },
    include: {
      pharmacy: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Recuperer les alternatives si en rupture
  let alternatives: any[] = [];
  if (medication.status === "RUPTURE" && medication.alternatives.length > 0) {
    alternatives = await prisma.medication.findMany({
      where: {
        cisCode: { in: medication.alternatives },
        status: { not: "RUPTURE" },
      },
    });
  }

  // Determiner le status
  const statusConfig = {
    RUPTURE: {
      color: "red",
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-200",
      icon: AlertTriangle,
      label: "Rupture de stock",
      description: "Ce medicament est actuellement indisponible au niveau national.",
    },
    TENSION: {
      color: "orange",
      bg: "bg-orange-100",
      text: "text-orange-700",
      border: "border-orange-200",
      icon: Clock,
      label: "Tension d'approvisionnement",
      description: "Ce medicament est difficile a trouver mais pas totalement indisponible.",
    },
    AVAILABLE: {
      color: "green",
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
      icon: CheckCircle2,
      label: "Disponible",
      description: "Ce medicament est normalement disponible en pharmacie.",
    },
    UNKNOWN: {
      color: "gray",
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
      icon: Clock,
      label: "Statut inconnu",
      description: "Le statut de ce medicament n'est pas encore determine.",
    },
  };

  const status = statusConfig[medication.status] || statusConfig.UNKNOWN;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Pill className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">MediTrouve</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb SEO */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-teal-600">
                Accueil
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/ruptures" className="hover:text-teal-600">
                Ruptures
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium">{medication.name}</li>
          </ol>
        </nav>

        {/* Status Banner */}
        <div className={`${status.bg} ${status.border} border-2 rounded-2xl p-6 mb-8`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 bg-white rounded-xl shadow-sm`}>
              <StatusIcon className={`h-8 w-8 ${status.text}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-3 py-1 ${status.bg} ${status.text} rounded-full text-sm font-medium`}>
                  {status.label}
                </span>
                {medication.isMITM && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    MITM
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {medication.name}
              </h1>
              <p className="text-gray-600">{status.description}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Informations
              </h2>
              <dl className="grid grid-cols-2 gap-4">
                {medication.laboratory && (
                  <div>
                    <dt className="text-sm text-gray-500">Laboratoire</dt>
                    <dd className="font-medium text-gray-900">{medication.laboratory}</dd>
                  </div>
                )}
                {medication.activeIngredient && (
                  <div>
                    <dt className="text-sm text-gray-500">Principe actif (DCI)</dt>
                    <dd className="font-medium text-gray-900">{medication.activeIngredient}</dd>
                  </div>
                )}
                {medication.dosage && (
                  <div>
                    <dt className="text-sm text-gray-500">Dosage</dt>
                    <dd className="font-medium text-gray-900">{medication.dosage}</dd>
                  </div>
                )}
                {medication.form && (
                  <div>
                    <dt className="text-sm text-gray-500">Forme</dt>
                    <dd className="font-medium text-gray-900">{medication.form}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-gray-500">Code CIS</dt>
                  <dd className="font-medium text-gray-900">{medication.cisCode}</dd>
                </div>
                {medication.cip13 && (
                  <div>
                    <dt className="text-sm text-gray-500">Code CIP13</dt>
                    <dd className="font-medium text-gray-900">{medication.cip13}</dd>
                  </div>
                )}
                {medication.expectedReturn && (
                  <div className="col-span-2">
                    <dt className="text-sm text-gray-500">Retour prevu</dt>
                    <dd className="font-medium text-orange-600">
                      {new Date(medication.expectedReturn).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Pharmacies avec stock */}
            {reports.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Pharmacies ayant du stock ({reports.length})
                  </span>
                </h2>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{report.pharmacy.name}</p>
                        <p className="text-sm text-gray-600">
                          {report.pharmacy.address}, {report.pharmacy.city}
                        </p>
                        {report.verifiedBy > 0 && (
                          <p className="text-xs text-green-600 mt-1">
                            Verifie par {report.verifiedBy} personne(s)
                          </p>
                        )}
                      </div>
                      {report.pharmacy.phone && (
                        <a
                          href={`tel:${report.pharmacy.phone}`}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all"
                        >
                          Appeler
                        </a>
                      )}
                    </div>
                  ))}
                </div>
                <Link
                  href={`/carte?medicament=${medication.id}`}
                  className="flex items-center justify-center gap-2 mt-4 py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-all"
                >
                  <MapPin className="h-4 w-4" />
                  Voir toutes les pharmacies sur la carte
                </Link>
              </div>
            )}

            {/* Alternatives */}
            {alternatives.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Alternatives disponibles
                </h2>
                <div className="space-y-3">
                  {alternatives.map((alt) => (
                    <Link
                      key={alt.id}
                      href={`/medicament/${alt.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${alt.cisCode}`}
                      className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{alt.name}</p>
                        <p className="text-sm text-gray-600">
                          {alt.laboratory} - {alt.dosage}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Disponible
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Historique */}
            {medication.statusHistory.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Historique des statuts
                </h2>
                <div className="space-y-3">
                  {medication.statusHistory.map((history) => (
                    <div
                      key={history.id}
                      className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="text-sm text-gray-500 w-24">
                        {new Date(history.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          history.status === "RUPTURE"
                            ? "bg-red-100 text-red-700"
                            : history.status === "TENSION"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {history.status}
                      </span>
                      <span className="text-sm text-gray-500">{history.source}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* CTA Alert */}
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white">
              <Bell className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-bold mb-2">
                Etre alerte des qu'il est disponible
              </h3>
              <p className="text-teal-100 text-sm mb-4">
                Recevez une notification instantanee quand {medication.name} redevient disponible.
              </p>
              <Link
                href={`/login?redirect=/alertes&medicament=${medication.id}`}
                className="block w-full py-3 bg-white text-teal-600 rounded-xl font-medium text-center hover:shadow-lg transition-all"
              >
                Creer une alerte gratuite
              </Link>
            </div>

            {/* Share */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-3">Partager</h3>
              <p className="text-sm text-gray-600 mb-4">
                Aidez d'autres patients a trouver cette information
              </p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all">
                  Facebook
                </button>
                <button className="flex-1 py-2 bg-sky-100 text-sky-600 rounded-lg text-sm font-medium hover:bg-sky-200 transition-all">
                  Twitter
                </button>
                <button className="flex-1 py-2 bg-green-100 text-green-600 rounded-lg text-sm font-medium hover:bg-green-200 transition-all">
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Source */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-3">Source officielle</h3>
              <p className="text-sm text-gray-600 mb-4">
                Donnees issues de l'ANSM (Agence nationale de securite du medicament)
              </p>
              <a
                href="https://ansm.sante.fr/disponibilites-des-produits-de-sante/medicaments"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-teal-600 text-sm font-medium hover:underline"
              >
                Consulter l'ANSM
                <ExternalLink className="h-4 w-4" />
              </a>
              <p className="text-xs text-gray-400 mt-3">
                Derniere verification : {new Date(medication.lastChecked).toLocaleDateString("fr-FR")}
              </p>
            </div>

            {/* App Download */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">
                Telecharger l'application
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Alertes instantanees, carte des pharmacies et plus encore
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 py-2 bg-black text-white rounded-lg text-sm font-medium"
                >
                  App Store
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 py-2 bg-black text-white rounded-lg text-sm font-medium"
                >
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Schema.org JSON-LD pour SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Drug",
              name: medication.name,
              activeIngredient: medication.activeIngredient,
              manufacturer: medication.laboratory
                ? {
                    "@type": "Organization",
                    name: medication.laboratory,
                  }
                : undefined,
              dosageForm: medication.form,
            }),
          }}
        />
      </main>

      {/* Footer SEO */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p className="mb-2">
            MediTrouve - Trouvez vos medicaments en rupture de stock
          </p>
          <p>
            <Link href="/ruptures" className="text-teal-600 hover:underline">
              Tous les medicaments en rupture
            </Link>
            {" | "}
            <Link href="/alertes" className="text-teal-600 hover:underline">
              Creer une alerte
            </Link>
            {" | "}
            <Link href="/carte" className="text-teal-600 hover:underline">
              Carte des pharmacies
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
