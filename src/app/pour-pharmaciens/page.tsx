import { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Users,
  TrendingDown,
  Bell,
  MapPin,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Building2,
  Shield,
  Zap,
  Download,
  Pill
} from "lucide-react";

export const metadata: Metadata = {
  title: "MediTrouve pour Pharmaciens - Reduisez les demandes inutiles",
  description: "Informez vos patients en temps reel sur les ruptures de medicaments. Gagnez du temps, ameliorez la satisfaction client.",
};

export default function PourPharmaciens() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-2 rounded-xl">
                <Pill className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                MediTrouve
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/pharmacien/inscription"
                className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Inscription gratuite
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-cyan-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
              <Building2 className="h-4 w-4" />
              Solution pour pharmacies
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Reduisez de{" "}
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                80%
              </span>{" "}
              les demandes sur les ruptures
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Vos patients consultent MediTrouve avant de venir.
              Ils ne vous posent plus la question 10 fois par jour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pharmacien/inscription"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-teal-500/25 transition-all"
              >
                Inscription gratuite
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-teal-300 transition-all"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Le probleme que vous connaissez bien
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chaque jour, vous perdez un temps precieux avec des patients mal informes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1-3h perdues par jour</h3>
              <p className="text-gray-600">
                A repondre aux memes questions sur les medicaments en rupture.
                "Est-ce que vous avez l'Ozempic ?" "Non, toujours pas."
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Patients frustres</h3>
              <p className="text-gray-600">
                Ils se deplacent pour rien, attendent, et repartent decus.
                La frustration se reporte sur votre equipe.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Phone className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Appels incessants</h3>
              <p className="text-gray-600">
                Le telephone sonne pour verifier si tel ou tel medicament
                est revenu en stock. Ca n'arrete jamais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              La solution : informez vos patients en amont
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Avec MediTrouve, vos patients savent AVANT de venir si leur medicament est disponible
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Donnees officielles ANSM
                  </h3>
                  <p className="text-gray-600">
                    Informations fiables mises a jour quotidiennement
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bell className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Alertes automatiques
                  </h3>
                  <p className="text-gray-600">
                    Vos patients sont prevenus des que le medicament revient
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Visibilite sur la carte
                  </h3>
                  <p className="text-gray-600">
                    Signalez vos disponibilites, attirez de nouveaux patients
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    100% gratuit pour vous
                  </h3>
                  <p className="text-gray-600">
                    Aucun abonnement, aucune commission, aucun engagement
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 border border-teal-100">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pharmacie du Centre</p>
                    <p className="text-sm text-gray-500">Paris 15e</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <span className="text-gray-700">Doliprane 1000mg</span>
                    <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Disponible
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <span className="text-gray-700">Spasfon</span>
                    <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Disponible
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                    <span className="text-gray-700">Ozempic</span>
                    <span className="text-sm font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                      Rupture nationale
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">80%</p>
              <p className="text-teal-100">de demandes en moins</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">2h</p>
              <p className="text-teal-100">gagnees par jour</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">3000+</p>
              <p className="text-teal-100">medicaments suivis</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">0EUR</p>
              <p className="text-teal-100">pour les pharmacies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Kit Communication */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kit de communication gratuit
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tout le materiel pour informer vos patients, pret a l'emploi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Pill className="h-12 w-12 text-teal-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Affiche A4</p>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Affiche comptoir</h3>
              <p className="text-sm text-gray-600 mb-4">
                A placer pres de la caisse avec QR code
              </p>
              <button className="flex items-center justify-center gap-2 w-full py-2 border border-teal-200 text-teal-600 rounded-xl hover:bg-teal-50 transition-colors">
                <Download className="h-4 w-4" />
                Telecharger
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-teal-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Sticker vitrine</p>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sticker vitrine</h3>
              <p className="text-sm text-gray-600 mb-4">
                "Cette pharmacie recommande MediTrouve"
              </p>
              <button className="flex items-center justify-center gap-2 w-full py-2 border border-teal-200 text-teal-600 rounded-xl hover:bg-teal-50 transition-colors">
                <Download className="h-4 w-4" />
                Telecharger
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-12 w-12 text-teal-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Script equipe</p>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Script equipe</h3>
              <p className="text-sm text-gray-600 mb-4">
                Ce que dire aux patients qui demandent
              </p>
              <button className="flex items-center justify-center gap-2 w-full py-2 border border-teal-200 text-teal-600 rounded-xl hover:bg-teal-50 transition-colors">
                <Download className="h-4 w-4" />
                Telecharger
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50" id="contact">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pret a gagner du temps ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Inscription gratuite en 2 minutes. Aucun engagement.
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Nom de la pharmacie"
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
              />
              <input
                type="text"
                placeholder="Numero FINESS"
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
              />
              <input
                type="email"
                placeholder="Email professionnel"
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
              />
              <input
                type="tel"
                placeholder="Telephone"
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
              />
            </div>
            <button className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
              Demander un acces
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Nous vous recontactons sous 24h pour valider votre inscription
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span>pharmacie@meditrouve.fr</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-1.5 rounded-lg">
                <Pill className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">MediTrouve</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 MediTrouve. Donnees officielles ANSM.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <Link href="/cgu" className="hover:text-gray-900">CGU</Link>
              <Link href="/confidentialite" className="hover:text-gray-900">Confidentialite</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
