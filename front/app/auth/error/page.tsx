
"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "Il y a un problème avec la configuration du serveur.";
      case "AccessDenied":
        return "Accès refusé. Vous avez annulé la connexion.";
      case "Verification":
        return "Le token a expiré ou a déjà été utilisé.";
      default:
        return "Une erreur inattendue s'est produite lors de la connexion.";
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="font-extrabold text-2xl tracking-tight bg-neutral-900 rounded-lg px-3 py-1 border border-neutral-800">
            BR
          </span>
          <span className="text-neutral-400 font-medium text-lg tracking-tight">
            Background Remover
          </span>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Erreur de connexion</h1>
          <p className="text-neutral-400">{getErrorMessage(error)}</p>
        </div>
        <div className="space-y-4 pt-4">
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-neutral-900 font-medium rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Réessayer
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-neutral-700 text-neutral-300 font-medium rounded-lg hover:border-neutral-600 hover:bg-neutral-900 transition-all"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ErrorContent />
    </Suspense>
  );
}