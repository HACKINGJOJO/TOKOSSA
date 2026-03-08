import * as Sentry from '@sentry/nextjs'

/**
 * Configuration Sentry cote client.
 * Active uniquement en production et si SENTRY_DSN est defini.
 */
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Envoyer 20% des transactions en production (ajuster selon le trafic)
    tracesSampleRate: 0.2,

    // Envoyer 100% des erreurs
    sampleRate: 1.0,

    // Replay des sessions avec erreurs
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,

    // Desactiver en dev
    enabled: process.env.NODE_ENV === 'production',

    // Filtrer les erreurs non pertinentes
    ignoreErrors: [
      // Erreurs reseau du navigateur
      'Network request failed',
      'Failed to fetch',
      'Load failed',
      // Erreurs d'extensions navigateur
      'Non-Error exception captured',
      'ResizeObserver loop limit exceeded',
    ],

    // Tag TOKOSSA pour filtrer dans le dashboard Sentry
    initialScope: {
      tags: {
        app: 'tokossa',
        market: 'benin',
      },
    },
  })
}
