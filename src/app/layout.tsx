import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/providers/session-provider";
import CookieConsent from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediTrouve - Trouvez vos médicaments en rupture de stock",
  description: "Trouvez vos médicaments en rupture de stock, localisez les pharmacies qui les ont et recevez des alertes de disponibilité.",
  keywords: ["médicaments", "rupture de stock", "pharmacie", "santé", "ordonnance", "pénurie"],
  authors: [{ name: "MediTrouve" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "MediTrouve - Trouvez vos médicaments",
    description: "Trouvez vos médicaments en rupture de stock et localisez les pharmacies qui les ont.",
    siteName: "MediTrouve",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediTrouve - Trouvez vos médicaments",
    description: "Trouvez vos médicaments en rupture de stock et localisez les pharmacies qui les ont.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <CookieConsent />
        </SessionProvider>
      </body>
    </html>
  );
}
