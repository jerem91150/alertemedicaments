import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="text-9xl font-bold text-blue-600">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page introuvable
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/medications"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Rechercher un médicament
          </Link>
        </div>
      </div>
    </div>
  );
}
