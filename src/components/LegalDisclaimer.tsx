import { AlertTriangle } from "lucide-react";

interface LegalDisclaimerProps {
  variant?: "default" | "compact" | "banner";
  className?: string;
}

export default function LegalDisclaimer({ variant = "default", className = "" }: LegalDisclaimerProps) {
  if (variant === "banner") {
    return (
      <div className={`bg-amber-50 border border-amber-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            <strong>Avertissement :</strong> MediTrouve est un service d&apos;information et ne constitue pas un dispositif medical.
            Consultez toujours un professionnel de sante pour toute question medicale.
          </p>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <p className={`text-xs text-gray-500 ${className}`}>
        MediTrouve est un service d&apos;information et ne remplace pas l&apos;avis d&apos;un professionnel de sante.
      </p>
    );
  }

  return (
    <div className={`p-4 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
      <p className="text-xs text-gray-500 text-center">
        <strong>Information importante :</strong> MediTrouve est un outil d&apos;information et ne constitue pas un dispositif medical.
        Les informations fournies ne remplacent pas l&apos;avis d&apos;un professionnel de sante.
        Consultez toujours votre medecin ou pharmacien pour toute question relative a votre traitement.
      </p>
    </div>
  );
}
