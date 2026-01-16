import { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  MapPin,
  Search,
  Smartphone,
  ChevronRight,
  Check,
  Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ozempic en rupture de stock - Ou le trouver ? | MediTrouve",
  description:
    "Ozempic est en rupture de stock. Trouvez les pharmacies qui l'ont encore disponible pres de chez vous avec MediTrouve. Alertes en temps reel et carte interactive.",
  keywords: [
    "Ozempic",
    "rupture",
    "penurie",
    "semaglutide",
    "diabete",
    "pharmacie",
    "disponibilite",
    "trouver",
    "stock",
  ],
  openGraph: {
    title: "Ozempic en rupture - Trouvez-le pres de chez vous",
    description:
      "Localisez les pharmacies ayant encore du stock d'Ozempic avec notre carte en temps reel",
    type: "website",
  },
};

export default function OzempicRupturePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-50 to-orange-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full mb-6">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Rupture de stock confirmee</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Ozempic en rupture ?
              <br />
              <span className="text-teal-600">Trouvez-le quand meme.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              MediTrouve vous aide a localiser les pharmacies qui ont encore du
              stock d'Ozempic pres de chez vous, grace a notre communaute de
              patients et pharmaciens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/inscription"
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Creer une alerte gratuite
              </Link>
              <Link
                href="/carte?medicament=ozempic"
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-teal-500 transition-all"
              >
                Voir la carte
              </Link>
            </div>
          </div>

          {/* Trust badges */}
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
              <span>Donnees verifiees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-red-600">87%</p>
              <p className="text-gray-600">des pharmacies en rupture</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-600">324</p>
              <p className="text-gray-600">pharmacies avec stock</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-orange-600">~6 mois</p>
              <p className="text-gray-600">duree estimee de la penurie</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comment trouver Ozempic ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                1. Recherchez
              </h3>
              <p className="text-gray-600">
                Entrez votre medicament et votre localisation pour voir les
                pharmacies a proximite
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                2. Localisez
              </h3>
              <p className="text-gray-600">
                Notre carte interactive vous montre les pharmacies ayant signale
                du stock disponible
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                3. Soyez alerte
              </h3>
              <p className="text-gray-600">
                Creez une alerte pour etre notifie des que le medicament est
                disponible pres de vous
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Ozempic */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Pourquoi Ozempic est en rupture ?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Ozempic (semaglutide) est un medicament initialement prescrit pour
              le traitement du diabete de type 2. La penurie actuelle est
              principalement due a une demande mondiale exceptionnelle, amplifiee
              par son utilisation hors AMM pour la perte de poids.
            </p>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">
              Que faire si vous etes diabetique ?
            </h3>
            <ul className="space-y-2">
              <li>
                <strong>Consultez votre medecin</strong> pour discuter des
                alternatives disponibles
              </li>
              <li>
                <strong>Ne modifiez jamais</strong> votre traitement sans avis
                medical
              </li>
              <li>
                <strong>Utilisez MediTrouve</strong> pour etre alerte des que le
                medicament est disponible
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ne perdez plus de temps a chercher
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Creez votre alerte gratuite et soyez notifie des qu'Ozempic est
            disponible pres de chez vous
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
            Les informations fournies sont a titre indicatif et ne remplacent pas
            un avis medical. Consultez toujours votre medecin ou pharmacien.
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
