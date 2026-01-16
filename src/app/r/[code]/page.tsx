import { redirect } from "next/navigation";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ platform?: string }>;
}

// Page de redirection pour le tracking des QR codes pharmacie
export default async function ReferralRedirectPage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const { platform } = await searchParams;

  // TODO: Logger le scan dans la base de donnees
  // await prisma.qrScan.create({
  //   data: {
  //     code,
  //     platform: platform || 'web',
  //     userAgent: headers().get('user-agent'),
  //     timestamp: new Date(),
  //   },
  // });

  // Log pour le tracking (temporaire)
  console.log(`QR Scan: code=${code}, platform=${platform || "web"}`);

  // Detecter la plateforme si non specifiee
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);

  // URLs des stores
  const appStoreUrl = "https://apps.apple.com/app/meditrouve/id123456789"; // TODO: Remplacer par la vraie URL
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.meditrouve.app"; // TODO: Remplacer par la vraie URL
  const webAppUrl = `/?ref=${code}`;

  // Rediriger vers le bon store ou l'app web
  if (platform === "ios" || (isIOS && !platform)) {
    redirect(appStoreUrl);
  } else if (platform === "android" || (isAndroid && !platform)) {
    redirect(playStoreUrl);
  } else {
    // Rediriger vers l'app web avec le code de reference
    redirect(webAppUrl);
  }
}

// Generer les metadonnees pour le partage
export async function generateMetadata({ params }: PageProps) {
  return {
    title: "Telecharger MediTrouve - Trouvez vos medicaments",
    description:
      "Telechargez MediTrouve pour trouver les medicaments en rupture de stock pres de chez vous. Alertes en temps reel et carte des pharmacies.",
    openGraph: {
      title: "MediTrouve - Trouvez vos medicaments",
      description: "L'application qui vous aide a trouver les medicaments en rupture de stock",
      type: "website",
    },
  };
}
