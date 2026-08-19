import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "",

  // Server-side tracing for API routes and SSR
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // GDPR & student privacy compliance
  sendDefaultPii: false,

  environment: process.env.APP_ENVIRONMENT || "development",

  // Attach server context to every event
  beforeSend(event) {
    // Strip any accidentally-attached student PII from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((crumb) => {
        if (crumb.data && crumb.data.body) {
          delete crumb.data.body;
        }
        return crumb;
      });
    }
    return event;
  },
});
