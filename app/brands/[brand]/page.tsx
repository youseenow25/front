import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import brandsSchema from '@/components/brands'
import BrandReceiptGenerator from '@/components/BrandReceiptGenerator'

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
  const description = `Generate authentic ${brandName} receipts instantly. Create professional ${brandName} invoice templates with real designs, logos, and formatting.`
  
  return {
    title: `${brandName} Receipt Generator - Create Authentic ${brandName} Invoices | HubReceipts`,
    description: description,
    keywords: [
      `${brandName} receipt`,
      `${brandName} invoice`,
      `${brandName} receipt generator`,
      `${brandName} invoice template`,
      `${brand.toLowerCase()} receipt maker`,
      'luxury brand receipts',
      'authentic receipt generator'
    ].join(', '),
    openGraph: {
      title: `${brandName} Receipt Generator - HubReceipts`,
      description: description,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brandName} Receipt Generator - HubReceipts`,
      description: description,
    },
    alternates: {
      canonical: `https://hubreceipts.com/brands/${brand}`
    }
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

export default function BrandPage({ params }: Props) {
  const brand = params.brand
  const brandData = brandsSchema.brands[brand]
  
  if (!brandData) {
    notFound()
  }

  return <BrandReceiptGenerator preSelectedBrand={brand} />
}

// Generate static params for all brands
export async function generateStaticParams() {
  const brands = Object.keys(brandsSchema.brands || {})
  
  return brands.map((brand) => ({
    brand: brand,
  }))
}