import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import brandsSchema from '@/components/brands'
import BrandReceiptGenerator from '@/components/BrandReceiptGenerator'
import { Suspense } from 'react'

type Props = {
  params: { brand: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const brand = params.brand
  const brandData = brandsSchema.brands[brand]
  
  if (!brandData) {
    return {
      title: 'Brand Not Found - HubReceipts',
    }
  }

  const brandName = toLabel(brand)
  const description = `Generate authentic ${brandName} receipts instantly. Create professional ${brandName} invoice templates with real designs, logos, and formatting. Free ${brandName} receipt maker.`
  
  return {
    title: `${brandName} Receipt Generator - Create Authentic ${brandName} Invoices | HubReceipts`,
    description: description,
    keywords: [
      `${brandName} receipt`,
      `${brandName} invoice`,
      `${brandName} receipt generator`,
      `${brandName} invoice template`,
      `${brandName.toLowerCase()} receipt maker`,
      'free receipt generator',
      'luxury brand receipts',
      'authentic receipt generator'
    ].join(', '),
    openGraph: {
      title: `${brandName} Receipt Generator - HubReceipts`,
      description: description,
      type: 'website',
      locale: 'en_US',
      url: `https://hubreceipts.com/brands/${brand}`,
      siteName: 'HubReceipts',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brandName} Receipt Generator - HubReceipts`,
      description: description,
    },
    alternates: {
      canonical: `https://hubreceipts.com/brands/${brand}`
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

function toLabel(name: string): string {
  const special: Record<string, string> = {
    zip_code: "ZIP Code",
    product_id: "Product ID",
    order_number: "Order Number",
    phone_number: "Phone Number",
    brand_name: "Brand Name",
    taxes_percentatge: "Taxes Percentatge",
    currency: "Currency",
  };
  if (special[name]) return special[name];
  return name
    .split("_")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Loading component for Suspense fallback
function BrandPageLoading() {
  return (
    <div className="brand-receipt-generator">
      <div className="brand-header">
        <h1>Loading...</h1>
      </div>
    </div>
  )
}

export default function BrandPage({ params }: Props) {
  const brand = params.brand
  const brandData = brandsSchema.brands[brand]
  
  if (!brandData) {
    notFound()
  }

  return (
    <Suspense fallback={<BrandPageLoading />}>
      <BrandReceiptGenerator preSelectedBrand={brand} />
    </Suspense>
  )
}

// Generate static params for all brands
export async function generateStaticParams() {
  const brands = Object.keys(brandsSchema.brands || {})
  
  return brands.map((brand) => ({
    brand: brand,
  }))
}

// Revalidate every 24 hours
export const revalidate = 86400