"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  FileText,
  Pill,
  Check,
  Loader2,
  Clock,
  Shield,
  Bell
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrdonnancePage() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    redirect("/login");
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Scanner une ordonnance</h1>
        <p className="text-gray-600 mt-1">
          Ajoutez automatiquement vos medicaments en scannant votre ordonnance
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="mb-8 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <div className="p-6 bg-white rounded-full shadow-lg">
                <Camera className="h-16 w-16 text-teal-600" />
              </div>
              <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                Bientot
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Fonctionnalite en preparation
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Le scan d'ordonnance par intelligence artificielle sera disponible prochainement.
                Nous mettons en place un hebergement certifie pour vos donnees de sante.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-teal-700 bg-teal-100 rounded-lg px-4 py-2 max-w-fit mx-auto">
              <Shield className="h-4 w-4" />
              <span>Certification HDS en cours</span>
            </div>

            <div className="pt-4">
              <Link href="/search">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Pill className="h-4 w-4 mr-2" />
                  Rechercher un medicament manuellement
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How it will work */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comment ca fonctionnera ?</CardTitle>
          <CardDescription>
            Une fois la fonctionnalite activee, vous pourrez :
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Camera className="h-6 w-6 text-teal-600" />
              </div>
              <h4 className="font-medium mb-1">1. Photographiez</h4>
              <p className="text-sm text-gray-600">
                Prenez en photo votre ordonnance bien lisible
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium mb-1">2. Analyse IA</h4>
              <p className="text-sm text-gray-600">
                Notre IA extrait automatiquement les medicaments
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium mb-1">3. Ajoutez</h4>
              <p className="text-sm text-gray-600">
                Selectionnez et ajoutez les medicaments a suivre
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notify me section */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Bell className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Soyez informe du lancement</h3>
              <p className="text-sm text-gray-600">
                Nous vous enverrons une notification des que cette fonctionnalite sera disponible.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal disclaimer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          <strong>Information importante :</strong> MediTrouve est un outil d'information et ne constitue pas un dispositif medical.
          Les informations fournies ne remplacent pas l'avis d'un professionnel de sante.
          Consultez toujours votre medecin ou pharmacien pour toute question relative a votre traitement.
        </p>
      </div>
    </div>
  );
}
