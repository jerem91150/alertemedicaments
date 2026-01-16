import { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Bell, Check, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Doliprane en rupture de stock - Alternatives et disponibilite | MediTrouve",
  description:
    "Le Doliprane est en tension. Trouvez les pharmacies avec du stock ou decouvrez les alternatives au paracetamol. Alertes en temps reel sur MediTrouve.",
  keywords: [
    "doliprane",
    "rupture",
    "paracetamol",
    "alternative",
    "efferalgan",
    "dafalgan",
    "pharmacie",
    "stock",
  ],
  openGraph: {
    title: "Doliprane en rupture - Alternatives et ou le trouver",
    description: "Localisez le Doliprane ou trouvez des alternatives",
    type: "website",
  },
};

export default function DolipraneRupturePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
              <Info className="h-4 w-4" />
              <span className="font-medium">Tension ponctuelle</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Doliprane introuvable ?
              <br />
              <span className="text-teal-600">Voici vos options.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Le Doliprane (paracetamol) connait parfois des tensions
              d'approvisionnement. Bonne nouvelle : de nombreuses alternatives
              equivalentes existent !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/carte?medicament=doliprane"
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Trouver du Doliprane
              </Link>
              <a
                href="#alternatives"
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-teal-500 transition-all"
              >
                Voir les alternatives
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Alternatives */}
      <section id="alternatives" className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Alternatives au Doliprane
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Tous ces medicaments contiennent du paracetamol et sont equivalents.
            Demandez conseil a votre pharmacien.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: "Efferalgan",
                lab: "Upsa",
                forms: "Comprimes, effervescents, sachets",
                note: "Equivalent exact",
              },
              {
                name: "Dafalgan",
                lab: "Upsa",
                forms: "Comprimes, gelules, sachets",
                note: "Equivalent exact",
              },
              {
                name: "Paracetamol Biogaran",
                lab: "Biogaran",
                forms: "Comprimes 500mg et 1000mg",
                note: "Generique - moins cher",
              },
              {
                name: "Paracetamol Sandoz",
                lab: "Sandoz",
                forms: "Comprimes, sachets",
                note: "Generique - moins cher",
              },
              {
                name: "Paracetamol Mylan",
                lab: "Mylan",
                forms: "Comprimes 500mg et 1000mg",
                note: "Generique - moins cher",
              },
              {
                name: "Paracetamol Arrow",
                lab: "Arrow",
                forms: "Comprimes, gelules",
                note: "Generique - moins cher",
              },
            ].map((alt, i) => (
              <div
                key={i}
                className="bg-green-50 border-2 border-green-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{alt.name}</p>
                    <p className="text-sm text-gray-600">{alt.lab}</p>
                    <p className="text-sm text-gray-500 mt-1">{alt.forms}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    {alt.note}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Important</p>
                <p className="text-sm text-gray-600">
                  Ne depassez jamais 3g de paracetamol par jour (4g pour les
                  adultes sur avis medical). En cas de doute, demandez conseil a
                  votre pharmacien.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dosages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Equivalences de dosage
          </h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Doliprane
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Equivalent
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Pour qui
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3">Doliprane 1000mg</td>
                  <td className="px-4 py-3">Paracetamol 1g</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Adultes</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Doliprane 500mg</td>
                  <td className="px-4 py-3">Paracetamol 500mg</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    Adultes, ados
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Doliprane sirop enfant</td>
                  <td className="px-4 py-3">Efferalgan pediatrique</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Enfants</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Doliprane suppositoire</td>
                  <td className="px-4 py-3">Dafalgan suppositoire</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    Bebes, enfants
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Besoin specifiquement de Doliprane ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Creez une alerte pour etre notifie quand il est disponible
          </p>
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <Bell className="h-5 w-5" />
            Creer mon alerte
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p className="mb-2">
            Les informations fournies sont a titre indicatif. Consultez toujours
            votre pharmacien avant de changer de medicament.
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
