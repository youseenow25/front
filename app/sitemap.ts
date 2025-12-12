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

  const receiptTemplatePages = brands.map((brand) => ({
    url: `${baseUrl}/receipt/${brand}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const emailReceiptPages = brands.map((brand) => ({
    url: `${baseUrl}/email-receipt/${brand}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
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
    // Exclude auth/payment/pricing routes from indexing via sitemap
    {
      url: `${baseUrl}/success`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...brandPages,
    ...receiptTemplatePages,
    ...emailReceiptPages,
  ]
}