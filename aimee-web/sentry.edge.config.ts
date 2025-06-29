import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',

  // Capture 100% of the transactions for performance monitoring in dev, 10% in prod
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Filter out edge function noise
  beforeSend(event) {
    // Filter out Next.js edge function errors that are not actionable
    if (event.exception?.values?.[0]?.value?.includes('fetch failed')) {
      return null;
    }

    return event;
  },

  // Custom tags for edge functions
  initialScope: {
    tags: {
      component: 'edge-function',
      runtime: 'edge',
    },
  },
}); 