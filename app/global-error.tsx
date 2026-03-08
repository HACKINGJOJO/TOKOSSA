'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

/**
 * Global Error Boundary — Capture les erreurs non gerees dans toute l'app.
 * Affiche une page d'erreur conviviale + envoie l'erreur a Sentry.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Envoyer l'erreur a Sentry
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="fr">
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">😥</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oups, une erreur est survenue
          </h1>
          <p className="text-gray-600 mb-6">
            Nous sommes desoles pour ce desagrement. Notre equipe a ete
            automatiquement notifiee.
          </p>
          <button
            onClick={reset}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Reessayer
          </button>
          <p className="mt-4 text-sm text-gray-400">
            Si le probleme persiste, contactez-nous sur WhatsApp
          </p>
        </div>
      </body>
    </html>
  )
}
