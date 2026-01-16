"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  MessageSquare,
  Check,
  Loader2,
  Clock,
  Video,
  Users,
} from "lucide-react";

export default function DemoRequestPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    pharmacyName: "",
    ownerName: "",
    email: "",
    phone: "",
    city: "",
    employeesCount: "",
    preferredTime: "",
    message: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/pharmacien/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Demande envoyee !
            </h1>
            <p className="text-gray-600 mb-6">
              Merci pour votre interet ! Notre equipe vous contactera sous 24h
              pour planifier votre demonstration personnalisee.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Un email de confirmation a ete envoye a{" "}
              <span className="font-medium text-teal-600">{formData.email}</span>
            </p>
            <Link
              href="/pour-pharmaciens"
              className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Retour a l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/pour-pharmaciens"
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MediTrouve</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Demandez une demonstration gratuite
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Decouvrez comment MediTrouve peut transformer la gestion des ruptures
              dans votre officine en 20 minutes.
            </p>

            {/* What's included */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
              <h3 className="font-bold text-gray-900 mb-4">
                Ce que vous decouvrirez :
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Video className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Demo en direct</p>
                    <p className="text-sm text-gray-500">
                      Tour complet du dashboard et des fonctionnalites
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <Users className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cas d'usage concrets</p>
                    <p className="text-sm text-gray-500">
                      Comment d'autres pharmacies utilisent MediTrouve
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Q&A personnalise</p>
                    <p className="text-sm text-gray-500">
                      Reponses a toutes vos questions specifiques
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-teal-600">20 min</p>
                <p className="text-sm text-gray-500">Duree de la demo</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-teal-600">100%</p>
                <p className="text-sm text-gray-500">Gratuit</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-teal-600">24h</p>
                <p className="text-sm text-gray-500">Delai de reponse</p>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Planifier ma demonstration
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la pharmacie *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.pharmacyName}
                    onChange={(e) => updateField("pharmacyName", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Pharmacie du Centre"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Votre nom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => updateField("ownerName", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Dr. Dupont"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Paris"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email professionnel *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="contact@pharmacie.fr"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telephone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="01 23 45 67 89"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre d'employes
                  </label>
                  <select
                    value={formData.employeesCount}
                    onChange={(e) => updateField("employeesCount", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Selectionnez</option>
                    <option value="1-3">1-3</option>
                    <option value="4-6">4-6</option>
                    <option value="7-10">7-10</option>
                    <option value="10+">10+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Creneau prefere
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => updateField("preferredTime", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Selectionnez</option>
                      <option value="morning">Matin (9h-12h)</option>
                      <option value="afternoon">Apres-midi (14h-17h)</option>
                      <option value="evening">Soiree (17h-19h)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optionnel)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                  placeholder="Questions ou besoins specifiques..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  "Demander ma demo gratuite"
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                En soumettant ce formulaire, vous acceptez d'etre contacte par notre equipe.
                Vos donnees ne seront jamais partagees.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
