/** @type {import('next').NextConfig} */
const nextConfig = {
  // Conditional standalone for Docker/Cloud Run while keeping standard Vercel serverless build
  ...(process.env.BUILD_STANDALONE === 'true' ? { output: 'standalone' } : {}),
};
export default nextConfig;
