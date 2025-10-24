/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Optional: for better deployment
  images: {
    domains: ['api.hubreceipts.com'], // Add your image domains if needed
  },
  // Add any other config you need
}

module.exports = nextConfig