import { MetadataRoute } from 'next'
import brandsSchema from '@/components/brands'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.repsreceipt.com'
  const lastMod = new Date().toISOString()

  const brands = Object.keys(brandsSchema.brands || {})

  const brandPages = brands.map((brand) => ({
    url: `${baseUrl}/brands/${brand}`,
    lastModified: lastMod,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const receiptTemplatePages = brands.map((brand) => ({
    url: `${baseUrl}/receipt/${brand}`,
    lastModified: lastMod,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const emailReceiptPages = brands.map((brand) => ({
    url: `${baseUrl}/email-receipt/${brand}`,
    lastModified: lastMod,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...brandPages,
    ...receiptTemplatePages,
    ...emailReceiptPages,
  ]
}