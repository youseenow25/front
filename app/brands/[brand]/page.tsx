import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import brandsSchema from '@/components/brands'
import BrandReceiptGenerator from '@/components/BrandReceiptGenerator'
import { Suspense } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero2'
import Link from 'next/link'

type Props = {
  params: { brand: string }
  searchParams: { [key: string]: string | string[] | undefined }
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
  const brands = [
    "apple", "gucci", "stockx", "nike", "flightclub", "louisvuitton", "saintlaurent","trapstar"
  ]

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
            <BrandReceiptGenerator
              preSelectedBrand={brand}
              title={`Create 1:1 ${brandName} Receipt`}
              headerTitle={`Create 1:1 ${brandName} Receipt`}
            />
          </Suspense>
        </div>

        {/* SEO-rich unique content (~230 words) */}
        <section className="brand-seo-rich">
          <div className="brand-seo-inner">
            <h2>{brandName} receipt templates that mirror real store formatting</h2>
            <p>
              Every {brandName} receipt you generate here is structured with the same fields customers
              expect on a legitimate proof of purchase—dates, taxes, totals, payment method, and itemized
              lines. We tune each template for the brand&apos;s usual fonts, spacing, and logo usage so your
              PDF looks polished when you download or share it. Because the generator is pre-loaded with
              {` ${brandName} `}placeholders, you can fill orders, warranty claims, or expense reports without
              wrestling with generic invoice builders that ignore luxury layout nuances.
            </p>
            <p>
              Use the uploader to attach product photos or order confirmations and keep everything in one
              place. You can switch currencies, adjust taxes, and localize content so the receipt fits
              the market you are submitting to. If you handle returns or customer support, the structured
              fields help teams verify purchases faster. Our system saves you time on formatting while
              keeping sensitive info local in your browser until you export. Frequent brands our users
              generate include Apple, Gucci, StockX, Nike, Flight Club, Louis Vuitton, Saint Laurent, and
              Trapstar, but the tool supports 100+ options with consistent accuracy.
            </p>
            <ul>
              <li>Accurate brand logos rendered at optimal size for printing and PDF.</li>
              <li>Currency-aware totals with optional tax lines to match regional norms.</li>
              <li>Email delivery or instant download so you can forward receipts quickly.</li>
              <li>Mobile-friendly editor to tweak numbers or names on the go.</li>
              <li>Structured data and meta tags so search engines understand the page context.</li>
            </ul>
            <p className="brand-links">
              Explore other flows: <Link href={`/receipt/${brand}`}>downloadable PDF receipts</Link> ·{' '}
              <Link href={`/email-receipt/${brand}`}>email receipt builder</Link> ·{' '}
              <Link href="/brands">all brands directory</Link> ·{' '}
              <Link href="/pricing">pricing</Link>
            </p>
            <p>
              Start by selecting {brandName}, enter your order details, and export. Your receipt stays editable
              until you download, letting you correct typos or adjust quantities before you share it. The goal
              is a crisp, authentic-looking {brandName} receipt with the right balance of branding and clarity.
            </p>
          </div>
        </section>
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
          min-height: 100vh;
          padding-top: 12px;
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

// Use dynamic rendering to avoid build timeout
export const dynamic = 'force-dynamic'
export const dynamicParams = true

// Optionally generate only popular brands at build time
export async function generateStaticParams() {
  // Only generate top 20 most popular brands to avoid timeout
  const popularBrands = [
    'apple', 'nike', 'gucci', 'stockx', 'louisvuitton', 
    'adidas', 'amazon', 'supreme', 'balenciaga', 'dior',
    'offwhite', 'prada', 'saintlaurent', 'trapstar', 'flightclub',
    'goat', 'farfetch', 'ssense', 'end', 'canadagoose'
  ]
  
  return popularBrands
    .filter(brand => brandsSchema.brands[brand])
    .map((brand) => ({
      brand: brand,
    }))
}