import { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Bell, MapPin, Search, Check, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Amoxicilline en rupture de stock - Ou la trouver ? | MediTrouve",
  description:
    "L'amoxicilline est en tension d'approvisionnement. Trouvez les pharmacies qui l'ont en stock pres de chez vous avec MediTrouve. Alertes en temps reel.",
  keywords: [
    "amoxicilline",
    "rupture",
    "penurie",
    "antibiotique",
    "pharmacie",
    "stock",
    "trouver",
    "disponibilite",
  ],
  openGraph: {
    title: "Amoxicilline en rupture - Trouvez-la pres de chez vous",
    description: "Localisez les pharmacies ayant encore de l'amoxicilline en stock",
    type: "website",
  },
};

export default function AmoxicillineRupturePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-yellow-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full mb-6">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Tension d'approvisionnement</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Amoxicilline introuvable ?
              <br />
              <span className="text-teal-600">On vous aide a la trouver.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              L'amoxicilline, antibiotique le plus prescrit en France, connait des
              tensions d'approvisionnement. MediTrouve vous aide a localiser les
              pharmacies qui en ont encore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/inscription"
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Creer une alerte gratuite
              </Link>
              <Link
                href="/carte?medicament=amoxicilline"
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-teal-500 transition-all"
              >
                Voir la carte
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>100% gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Temps reel</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Toutes les formes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Formes concernees */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Formes d'amoxicilline concernees
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Amoxicilline 500mg", form: "Gelules", status: "tension" },
              { name: "Amoxicilline 1g", form: "Comprimes", status: "tension" },
              { name: "Amoxicilline sirop", form: "Suspension", status: "rupture" },
              { name: "Clamoxyl 500mg", form: "Gelules", status: "tension" },
              { name: "Clamoxyl 1g", form: "Sachets", status: "disponible" },
              { name: "Amoxicilline/Ac. clav.", form: "Augmentin", status: "tension" },
            ].map((med, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border-2 ${
                  med.status === "rupture"
                    ? "border-red-200 bg-red-50"
                    : med.status === "tension"
                    ? "border-orange-200 bg-orange-50"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <p className="font-semibold text-gray-900">{med.name}</p>
                <p className="text-sm text-gray-600">{med.form}</p>
                <span
                  className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                    med.status === "rupture"
                      ? "bg-red-100 text-red-700"
                      : med.status === "tension"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {med.status === "rupture"
                    ? "Rupture"
                    : med.status === "tension"
                    ? "Tension"
                    : "Disponible"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Que faire */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Que faire si vous avez besoin d'amoxicilline ?
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                1. Ne modifiez pas votre traitement
              </h3>
              <p className="text-gray-600">
                Si votre medecin vous a prescrit de l'amoxicilline, ne changez pas
                d'antibiotique sans son accord. Les antibiotiques ne sont pas
                interchangeables.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                2. Appelez plusieurs pharmacies
              </h3>
              <p className="text-gray-600">
                Utilisez MediTrouve pour identifier les pharmacies susceptibles
                d'avoir du stock, puis appelez pour confirmer avant de vous deplacer.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                3. Demandez une alternative a votre medecin
              </h3>
              <p className="text-gray-600">
                Si vous ne trouvez vraiment pas, votre medecin peut vous prescrire
                un autre antibiotique adapte a votre infection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Soyez alerte des que l'amoxicilline est disponible
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Creez une alerte gratuite et recevez une notification instantanee
          </p>
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <Bell className="h-5 w-5" />
            Creer mon alerte gratuite
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p className="mb-2">
            Les informations fournies sont a titre indicatif. Consultez toujours
            votre medecin ou pharmacien.
          </p>
          <p>
            <Link href="/" className="text-teal-600 hover:underline">
              MediTrouve
            </Link>
            {" - "}
            <Link href="/ruptures" className="text-teal-600 hover:underline">
              Tous les medicaments en rupture
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
