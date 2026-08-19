import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.2,
  environment: process.env.NODE_ENV || "production",

  beforeSend(event) {
    event.tags = {
      ...event.tags,
      server_runtime: "edge",
    };
    return event;
  },
});
