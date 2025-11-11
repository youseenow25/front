import { MetadataRoute } from 'next'
import brandsSchema from '../components/brands.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hubreceipts.com'
  const brands = Object.keys(brandsSchema.brands || {})
  
  const brandPages = brands.map((brand) => ({
    url: `${baseUrl}/brands/${brand}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...brandPages,
  ]
}