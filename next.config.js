/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['api.hubreceipts.com', 'lh3.googleusercontent.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 24, 32, 48, 64, 96],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Increase static page generation timeout to prevent build failures
  staticPageGenerationTimeout: 120,
}

module.exports = nextConfig