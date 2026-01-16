"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Building,
  FileText,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";

export default function PharmacienInscriptionPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    pharmacyName: "",
    finess: "",
    siret: "",
    ownerName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.passwordConfirm) {
      setError("Tous les champs sont obligatoires");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caracteres");
      return false;
    }
    if (formData.password !== formData.passwordConfirm) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.pharmacyName || !formData.finess || !formData.ownerName || !formData.phone) {
      setError("Tous les champs obligatoires doivent etre remplis");
      return false;
    }
    if (!/^\d{9}$/.test(formData.finess)) {
      setError("Le numero FINESS doit contenir 9 chiffres");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.address || !formData.city || !formData.postalCode) {
      setError("Tous les champs d'adresse sont obligatoires");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/pharmacien/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("Erreur de connexion au serveur");
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
              Demande enregistree !
            </h1>
            <p className="text-gray-600 mb-6">
              Votre demande d'inscription a ete enregistree. Notre equipe va verifier
              vos informations et valider votre compte sous 24 a 48 heures.
            </p>
            <p className="text-gray-600 mb-6">
              Vous recevrez un email de confirmation a l'adresse{" "}
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Store className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">MediTrouve</span>
          </Link>
          <p className="text-gray-600 mt-2">Inscription Pharmacien</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 ${
                    step > s ? "bg-teal-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {step === 1 && "Identifiants"}
            {step === 2 && "Informations pharmacie"}
            {step === 3 && "Adresse"}
          </h1>
          <p className="text-gray-500 text-center mb-6">
            {step === 1 && "Creez vos identifiants de connexion"}
            {step === 2 && "Informations legales de votre officine"}
            {step === 3 && "Adresse de votre pharmacie"}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {step === 1 && (
              <div className="space-y-4">
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
                      placeholder="pharmacie@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Minimum 8 caracteres"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.passwordConfirm}
                      onChange={(e) => updateField("passwordConfirm", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Confirmer le mot de passe"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
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
                      Numero FINESS *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.finess}
                        onChange={(e) => updateField("finess", e.target.value.replace(/\D/g, "").slice(0, 9))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="9 chiffres"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SIRET (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.siret}
                      onChange={(e) => updateField("siret", e.target.value.replace(/\D/g, "").slice(0, 14))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="14 chiffres"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du titulaire *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => updateField("ownerName", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Dr. Jean Dupont"
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
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="12 rue de la Sante"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Paris"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => updateField("postalCode", e.target.value.replace(/\D/g, "").slice(0, 5))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="75001"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Precedent
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : step === 3 ? (
                  "Creer mon compte"
                ) : (
                  "Suivant"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Deja inscrit ?{" "}
              <Link
                href="/pharmacien/login"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            En vous inscrivant, vous acceptez nos{" "}
            <Link href="/cgu" className="text-teal-600 hover:underline">
              CGU
            </Link>{" "}
            et notre{" "}
            <Link href="/confidentialite" className="text-teal-600 hover:underline">
              politique de confidentialite
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
