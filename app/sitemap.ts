import { MetadataRoute } from 'next'
import brandsSchema from '@/components/brands'

export default function sitemap(): MetadataRoute.Sitemap {
  // CAMBIA ESTA LÍNEA:
  const baseUrl = 'https://www.hubreceipts.com' // ← Agregar WWW aquí
  
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
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...brandPages,
  ]
}