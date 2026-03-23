import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin23456ergdfxdzrdm5/',
          '/login',
          '/register',
          '/payment',
          '/success',
          '/pricing',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/brands/',
          '/receipt/',
          '/email-receipt/',
          '/about',
          '/contact',
          '/privacy-policy',
          '/terms-of-service',
        ],
        disallow: [
          '/api/',
          '/admin23456ergdfxdzrdm5/',
          '/login',
          '/register',
          '/payment',
          '/success',
          '/pricing',
        ],
      },
    ],
    sitemap: 'https://www.repsreceipt.com/sitemap.xml',
  }
}
