import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",

  // Adjust tracing sample rate for production vs development
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session Replay for debugging user-reported issues
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // GDPR & student privacy: never send PII
  sendDefaultPii: false,

  // Filter noisy browser errors
  ignoreErrors: [
    "ResizeObserver loop",
    "Non-Error promise rejection",
    "Load failed",
  ],

  environment: process.env.NEXT_PUBLIC_APP_ENVIRONMENT || "development",
});
