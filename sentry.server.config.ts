import * as Sentry from '@sentry/nextjs'

/**
 * Configuration Sentry cote serveur.
 * Capture les erreurs dans les API Routes et Server Components.
 */
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Envoyer 20% des transactions en production
    tracesSampleRate: 0.2,

    // Envoyer 100% des erreurs
    sampleRate: 1.0,

    // Desactiver en dev
    enabled: process.env.NODE_ENV === 'production',

    // Tag TOKOSSA
    initialScope: {
      tags: {
        app: 'tokossa',
        runtime: 'server',
      },
    },
  })
}
