/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during build
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_BYPASS_AUTH: 'true',
  },
  // Explicitly configure server to listen on all interfaces
  serverExternalPackages: ['@supabase/ssr'],
};

module.exports = nextConfig;
