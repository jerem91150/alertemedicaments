"use client";

import { Check, Shield, Star } from "lucide-react";

interface PharmacyPartnerBadgeProps {
  isPartner: boolean;
  partnerSince?: Date;
  reportsCount?: number;
  variant?: "small" | "medium" | "large";
}

export default function PharmacyPartnerBadge({
  isPartner,
  partnerSince,
  reportsCount = 0,
  variant = "medium",
}: PharmacyPartnerBadgeProps) {
  if (!isPartner) {
    return null;
  }

  const sizeClasses = {
    small: {
      container: "px-2 py-1",
      icon: "h-3 w-3",
      text: "text-xs",
    },
    medium: {
      container: "px-3 py-1.5",
      icon: "h-4 w-4",
      text: "text-sm",
    },
    large: {
      container: "px-4 py-2",
      icon: "h-5 w-5",
      text: "text-base",
    },
  };

  const sizes = sizeClasses[variant];

  // Determiner le niveau de partenaire
  let level = "bronze";
  let levelColor = "bg-amber-100 text-amber-700 border-amber-200";
  let levelIcon = Shield;

  if (reportsCount >= 100) {
    level = "gold";
    levelColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
    levelIcon = Star;
  } else if (reportsCount >= 50) {
    level = "silver";
    levelColor = "bg-gray-100 text-gray-700 border-gray-200";
    levelIcon = Shield;
  }

  const LevelIcon = levelIcon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${sizes.container} ${levelColor} border rounded-full`}
      title={`Pharmacie partenaire MediTrouve${partnerSince ? ` depuis ${new Date(partnerSince).toLocaleDateString("fr-FR")}` : ""}`}
    >
      <LevelIcon className={sizes.icon} />
      <span className={`font-medium ${sizes.text}`}>
        Partenaire
        {variant === "large" && level !== "bronze" && (
          <span className="ml-1 capitalize">{level}</span>
        )}
      </span>
      {variant !== "small" && (
        <Check className={sizes.icon} />
      )}
    </div>
  );
}

// Composant pour afficher le badge sur une carte de pharmacie
export function PharmacyCardBadge({
  isPartner,
  reportsCount,
}: {
  isPartner: boolean;
  reportsCount?: number;
}) {
  if (!isPartner) {
    return null;
  }

  return (
    <div className="absolute top-2 right-2">
      <div className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
        <Check className="h-3 w-3" />
        Partenaire
      </div>
    </div>
  );
}
