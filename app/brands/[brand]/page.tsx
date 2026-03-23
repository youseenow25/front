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
      title: 'Brand Not Found - RepReceipts',
    }
  }
  const brandName = toLabel(brand)
  const description = `${brandName} receipt generator - create professional ${brandName} receipts with brand formatting, itemized details, and instant PDF export. Free online tool.`
  const logoUrl = `https://www.repsreceipt.com/brand-logos/${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webp`
  
  return {
    title: `${brandName} Receipt Generator - Create ${brandName} Receipts Online | RepReceipts`,
    description: description,
    keywords: [
      `${brandName} receipt`,
      `${brandName} email receipt`,
      `${brandName} receipt generator`,
      `${brandName} invoice template`,
      `${brandName.toLowerCase()} receipt maker`,
      `${brandName.toLowerCase()} receipt template`,
      'receipt generator online',
      'luxury brand receipts',
      'professional receipt creator'
    ],
    openGraph: {
      title: `${brandName} Receipt Generator - RepReceipts`,
      description: description,
      type: 'website',
      locale: 'en_US',
      url: `https://www.repsreceipt.com/brands/${brand}`,
      siteName: 'RepReceipts',
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
      title: `${brandName} Receipt Generator - RepReceipts`,
      description: description,
      images: [logoUrl],
    },
    alternates: {
      canonical: `https://www.repsreceipt.com/brands/${brand}`
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
  const logoUrl = `https://www.repsreceipt.com/brand-logos/${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webp`
  const brands = [
    "apple", "gucci", "stockx", "nike", "flightclub", "louisvuitton", "saintlaurent","trapstar"
  ]

  // ✅ CORRECT: Page-specific structured data for THIS brand only
  // ✅ CORRECTO para SaaS - Service Schema apropiado
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  'name': `${brandName} Receipt Generator`,
  'description': `Professional ${brandName} receipt generator with brand formatting and layout. Create ${brandName} invoice templates instantly.`,
  'image': logoUrl,
  'provider': {
    '@type': 'Organization',
    'name': 'RepReceipts',
    'url': 'https://www.repsreceipt.com'
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
  'termsOfService': 'https://www.repsreceipt.com/terms-of-service'
}

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': `Is the ${brandName} receipt generator free?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, basic receipt generation is free. Premium features like batch export and advanced templates are available with a paid plan.'
        }
      },
      {
        '@type': 'Question',
        'name': `What formats can I export ${brandName} receipts in?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'You can export as PDF for printing, or use the email receipt format for digital delivery.'
        }
      },
      {
        '@type': 'Question',
        'name': `Can I customize the currency on ${brandName} receipts?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, the generator supports multiple currencies including USD, EUR, GBP, and more with automatic formatting.'
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
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
              title={`${brandName} Receipt Generator`}
              headerTitle={`${brandName} Receipt Generator`}
            />
          </Suspense>
        </div>

        {/* SEO-rich unique content */}
        <section className="brand-seo-rich">
          <div className="brand-seo-inner">
            <h2>How the {brandName} Receipt Generator Works</h2>
            <p>
              The {brandName} receipt generator lets you build complete receipts with itemized product lines,
              tax calculations, payment method details, and order numbers. Each field is pre-configured with
              {` ${brandName}`}-specific formatting so you get a professional result without starting from scratch.
              Select your currency, enter product details, adjust quantities and prices, then export as PDF
              or send via email.
            </p>

            <h3>What You Can Customize</h3>
            <p>
              Every {brandName} receipt includes editable fields for store location, date, item descriptions,
              unit prices, tax rates, and payment type. You can add multiple line items, upload product images,
              and switch between currencies to match your region. The generator handles subtotals and tax
              calculations automatically as you type.
            </p>

            <h3>Output Formats</h3>
            <ul>
              <li>PDF download for printing or filing with accounting software.</li>
              <li>Email receipt format for sending order confirmations directly.</li>
              <li>Mobile-optimized layout that works on phones and tablets.</li>
              <li>Multi-currency support with automatic tax calculation.</li>
            </ul>

            <h3>Frequently Asked Questions</h3>
            <dl>
              <dt>Is the {brandName} receipt generator free?</dt>
              <dd>Yes, basic receipt generation is free. Premium features like batch export and advanced templates are available with a paid plan.</dd>
              <dt>What formats can I export {brandName} receipts in?</dt>
              <dd>You can export as PDF for printing, or use the email receipt format for digital delivery.</dd>
              <dt>Can I customize the currency on {brandName} receipts?</dt>
              <dd>Yes, the generator supports multiple currencies including USD, EUR, GBP, and more with automatic formatting.</dd>
            </dl>

            <p className="brand-links">
              Related tools: <Link href={`/receipt/${brand}`}>{brandName} PDF receipt template</Link> ·{' '}
              <Link href={`/email-receipt/${brand}`}>{brandName} email receipt</Link> ·{' '}
              <Link href="/brands">all brands</Link> ·{' '}
              <Link href="/about">about us</Link> ·{' '}
              <Link href="/contact">contact</Link>
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

// Generate all brand pages at build time for Google indexing
export async function generateStaticParams() {
  const brands = Object.keys(brandsSchema.brands || {})
  return brands.map((brand) => ({ brand }))
}

// Revalidate every 24 hours instead of force-dynamic
export const revalidate = 86400
export const dynamicParams = true