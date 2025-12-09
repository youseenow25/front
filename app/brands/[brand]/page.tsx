import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import brandsSchema from '@/components/brands'
import BrandReceiptGenerator from '@/components/BrandReceiptGenerator'
import { Suspense } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero2'

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
  const description = `Generate authentic ${brandName} receipts, 1:1 receipts`
  const logoUrl = `https://www.hubreceipts.com/brand-logos/${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webp`
  
  return {
    title: `${brandName} receipt template`,
    description: description,
    keywords: [
      `${brandName} receipt`,
      `${brandName} email receipt`,
      `${brandName} receipt generator`,
      `${brandName} invoice template`,
      `${brandName.toLowerCase()} receipt maker`,
      'free receipt generator',
      'luxury brand receipts',
      'authentic receipt generator'
    ],
    openGraph: {
      title: `${brandName} 1:1 receipt template`,
      description: description,
      type: 'website',
      locale: 'en_US',
      url: `https://www.hubreceipts.com/brands/${brand}`,
      siteName: 'HubReceipts',
      images: [
        {
          url: logoUrl,
          width: 200,
          height: 200,
          alt: `${brandName} Logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brandName} Receipt Generator - HubReceipts`,
      description: description,
      images: [logoUrl],
    },
    alternates: {
      canonical: `https://www.hubreceipts.com/brands/${brand}`
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
        <h1>Loading....</h1>
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

  const brandName = toLabel(brand)
  const logoUrl = `https://www.hubreceipts.com/brand-logos/${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webp`

  // ✅ CORRECT: Page-specific structured data for THIS brand only
  // ✅ CORRECTO para SaaS - Service Schema apropiado
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  'name': `${brandName} Receipt Generator`,
  'description': `Generate authentic ${brandName} receipts with official designs and formatting. Create professional ${brandName} invoice templates instantly.`,
  'image': logoUrl,
  'provider': {
    '@type': 'Organization',
    'name': 'HubReceipts',
    'url': 'https://www.hubreceipts.com'
  },
  'areaServed': 'Worldwide',
  'hasOfferCatalog': {
    '@type': 'OfferCatalog',
    'name': 'Receipt Generation Services',
    'itemListElement': [
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Free Receipt Generation',
          'description': `Generate ${brandName} receipts with basic features`
        },
        'price': '0',
        'priceCurrency': 'USD'
      },
      {
        '@type': 'Offer', 
        'itemOffered': {
          '@type': 'Service',
          'name': 'Premium Receipt Generation',
          'description': `Generate ${brandName} receipts with advanced features and premium templates`
        },
        'price': '4.99',
        'priceCurrency': 'USD'
      }
    ]
  },
  'termsOfService': 'https://www.hubreceipts.com/tos'
}

  return (
    <>
      {/* ✅ Add structured data for THIS specific brand page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="main">
        <div className="luxury-radial" aria-hidden />
        <Header />
        <Hero brandName={brandName} />
        
        {/* Brand Receipt Generator */}
        <div style={{width:'100%'}}>
          <Suspense fallback={<BrandPageLoading />}>
            <BrandReceiptGenerator preSelectedBrand={brand} />
          </Suspense>
        </div>
      </main>

      <style>{`
        .brand-hero-section {
          padding: 80px 0 60px;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          text-align: center;
        }

        .brand-hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .brand-hero-title {
          font-size: 3rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #d4af37, #c9b037);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-hero-description {
          font-size: 1.2rem;
          color: #666;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Luxury radial background */
        .luxury-radial {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 600px 400px at 20% 100px, rgba(212, 175, 55, 0.1), transparent 70%),
            radial-gradient(ellipse 800px 500px at 80% 300px, rgba(201, 176, 55, 0.08), transparent 70%),
            radial-gradient(ellipse 1000px 600px at center, rgba(0, 0, 0, 0.03), transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .main {
          position: relative;
          overflow: hidden;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .brand-hero-section {
            padding: 60px 0 40px;
          }

          .brand-hero-title {
            font-size: 2.2rem;
          }

          .brand-hero-description {
            font-size: 1.1rem;
            padding: 0 20px;
          }
        }

        @media (max-width: 480px) {
          .brand-hero-title {
            font-size: 1.8rem;
          }

          .brand-hero-description {
            fontSize: 1rem;
          }
        }
      `}</style>
    </>
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