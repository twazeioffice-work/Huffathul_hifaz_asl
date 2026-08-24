import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  fallbacks: {
    document: "/~offline",
  },
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
      {
        urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-fonts",
          expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 7 },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-images",
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      {
        urlPattern: /\.(?:js|css)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-resources",
          expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 7 },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Ensure Next.js listens strictly to non-collision ports (like Port 3001)
  // PM2 relies on the CLI argument to boot the Next daemon on the correct port for the Cloudflare tunnel
  env: {
    INTERNAL_API_URL: process.env.INTERNAL_API_URL || "http://localhost:8000",
  },

  // Conditional standalone for Docker/Cloud Run while keeping standard Vercel serverless build
  ...(process.env.BUILD_STANDALONE === 'true' ? { output: 'standalone' } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {}
};

export default withPWA(nextConfig);
