/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Optional: for better deployment
  images: {
    domains: ['api.hubreceipts.com'], // Add your image domains if needed
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
  // Add any other config you need
}

module.exports = nextConfig