import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,

  // Performance tracing
  tracesSampleRate: 0.2,

  environment: process.env.NODE_ENV || "production",

  // Enable profiling of server-side operations
  profilesSampleRate: 0.1,

  beforeSend(event) {
    // Flag server-side anomalies specifically
    event.tags = {
      ...event.tags,
      server_runtime: "nodejs",
    };
    return event;
  },
});
