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
    NEXT_PUBLIC_BYPASS_AUTH: process.env.NEXT_PUBLIC_BYPASS_AUTH || 'false',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    // Habilita o App Router
    appDir: true,
    // Desabilita o Server Actions warning
    serverActions: true,
  },
  // Desabilita a otimização de fonte durante o build
  optimizeFonts: false,
  // Desabilita a compressão durante o build
  compress: false,
  // Aumenta o limite de memória para o build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Desabilita a geração estática durante o build
  output: 'standalone',
};

module.exports = nextConfig;
