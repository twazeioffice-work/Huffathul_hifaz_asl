import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "",

  // Edge runtime has stricter size limits — keep sampling lean
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,

  // GDPR compliance
  sendDefaultPii: false,

  environment: process.env.APP_ENVIRONMENT || "development",
});
