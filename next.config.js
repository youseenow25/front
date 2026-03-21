/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output for better deployment
  output: 'standalone',
  images: {
    domains: ['api.repsreceipt.com', 'lh3.googleusercontent.com'],
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
  // Increase static page generation timeout for 300+ brand pages
  staticPageGenerationTimeout: 300,

  // SEO: Redirect non-www to www to prevent duplicate content
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'repsreceipt.com' }],
        destination: 'https://www.repsreceipt.com/:path*',
        permanent: true,
      },
    ]
  },

  // SEO: Add cache headers for static pages
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
        ],
      },
      {
        source: '/brands/:brand',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200' },
        ],
      },
      {
        source: '/receipt/:brand',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200' },
        ],
      },
      {
        source: '/email-receipt/:brand',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200' },
        ],
      },
    ]
  },
}

module.exports = nextConfig