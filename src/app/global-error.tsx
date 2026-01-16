'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
          <div className="text-center px-4">
            <div className="mb-8">
              <span className="text-9xl font-bold text-red-500">Erreur</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Erreur critique
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Une erreur inattendue s&apos;est produite. Veuillez rafraîchir la page.
            </p>
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
