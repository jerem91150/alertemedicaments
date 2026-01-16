'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur pour le monitoring (Sentry, etc.)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="text-9xl font-bold text-red-500">500</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Une erreur est survenue
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Nous sommes désolés, quelque chose s&apos;est mal passé. Notre équipe a été notifiée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Retour à l&apos;accueil
          </a>
        </div>
        {error.digest && (
          <p className="mt-8 text-sm text-gray-500">
            Code d&apos;erreur : {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
