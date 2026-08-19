import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for finer control
  tracesSampleRate: 0.1,

  // Replay integration to record user sessions for visual troubleshooting
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Capture React component rendering errors & safeguard sensitive multi-tenant student/parent data
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  environment: process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || "production",

  // Attach tenant context to trace logs dynamically
  beforeSend(event) {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      event.tags = {
        ...event.tags,
        hostname,
        client_runtime: "browser",
      };
    }
    return event;
  },
});
