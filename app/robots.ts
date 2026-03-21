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
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin23456ergdfxdzrdm5/',
          '/login',
          '/register',
          '/payment',
          '/success',
        ],
      },
    ],
    sitemap: 'https://www.repsreceipt.com/sitemap.xml',
  }
}