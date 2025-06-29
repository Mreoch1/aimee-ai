import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  
  // Capture 100% of the transactions for performance monitoring in dev, 10% in prod
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Filter out sensitive information
  beforeSend(event) {
    // Remove sensitive data from event
    if (event.request?.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
    }
    
    // Filter out Stripe webhook signature mismatches (expected in dev)
    if (event.exception?.values?.[0]?.value?.includes('webhook signature')) {
      return null;
    }
    
    return event;
  },
  
  // Custom tags for better error organization
  initialScope: {
    tags: {
      component: 'server',
    },
  },
}); 