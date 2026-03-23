import { MetadataRoute } from 'next'
import brandsSchema from '@/components/brands'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.repsreceipt.com'

  // Use a fixed date that you update when content actually changes
  // This prevents Google from seeing every page as "just modified" on every crawl
  const siteLastMod = '2026-03-23'
  const brandsLastMod = '2026-03-23'

  const brands = Object.keys(brandsSchema.brands || {})

  // Core pages - highest priority
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: siteLastMod,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: siteLastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Trust / legal pages
  const trustPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/about`,
      lastModified: siteLastMod,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: siteLastMod,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: siteLastMod,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: siteLastMod,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  // Brand generator pages - primary content pages (highest crawl value)
  const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${baseUrl}/brands/${brand}`,
    lastModified: brandsLastMod,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Receipt template pages
  const receiptTemplatePages: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${baseUrl}/receipt/${brand}`,
    lastModified: brandsLastMod,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Email receipt pages
  const emailReceiptPages: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${baseUrl}/email-receipt/${brand}`,
    lastModified: brandsLastMod,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...corePages,
    ...trustPages,
    ...brandPages,
    ...receiptTemplatePages,
    ...emailReceiptPages,
  ]
}
