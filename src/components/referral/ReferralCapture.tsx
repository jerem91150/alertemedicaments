"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Composant invisible à placer dans le layout racine.
 * Capture le paramètre ?ref=CODE dans l'URL et le stocke en localStorage
 * pour l'appliquer lors de l'inscription.
 */
export default function ReferralCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("referral_code", ref.toUpperCase());
      localStorage.setItem("referral_timestamp", Date.now().toString());
    }
  }, [searchParams]);

  return null;
}
