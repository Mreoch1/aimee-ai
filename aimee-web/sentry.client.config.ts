import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  
  // Capture 100% of the transactions for performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Filter out noise
  beforeSend(event) {
    // Filter out Next.js hydration errors
    if (event.exception?.values?.[0]?.value?.includes('Hydration')) {
      return null;
    }
    
    // Filter out network errors from ad blockers
    if (event.exception?.values?.[0]?.value?.includes('Non-Error promise rejection')) {
      return null;
    }
    
    return event;
  },
  
  integrations: [
    Sentry.replayIntegration({
      // Mask all text content, emails, and user inputs
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    }),
  ],
}); 