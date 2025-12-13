import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero2'
import BrandReceiptGenerator from '@/components/BrandReceiptGenerator'
import brandsSchema from '@/components/brands'
import Link from 'next/link'

type Props = {
  params: { brand: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

function toLabel(name: string): string {
  const special: Record<string, string> = {
    zip_code: 'ZIP Code',
    product_id: 'Product ID',
    order_number: 'Order Number',
    phone_number: 'Phone Number',
    brand_name: 'Brand Name',
    taxes_percentatge: 'Taxes Percentatge',
    currency: 'Currency',
  }
  if (special[name]) return special[name]
  return name
    .split('_')
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const brand = params.brand
  const brandData = brandsSchema.brands[brand]

  if (!brandData) {
    return {
      title: 'Brand Not Found - HubReceipts',
    }
  }

  const brandName = toLabel(brand)
  const description = `Build ${brandName} email receipts with correct layout, branding, and fields for customer confirmations.`
  const logoUrl = `https://www.hubreceipts.com/brand-logos/${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webp`

  return {
    title: `${brandName} email receipt`,
    description,
    keywords: [
      `${brandName} email receipt`,
      `${brandName} receipt email`,
      `${brandName} order confirmation`,
      `${brandName} e-receipt generator`,
      `${brandName} invoice email`,
      'email receipt template',
      'digital receipt generator',
    ],
    openGraph: {
      title: `${brandName} email receipt`,
      description,
      type: 'website',
      locale: 'en_US',
      url: `https://www.hubreceipts.com/email-receipt/${brand}`,
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
      title: `${brandName} Email Receipt - HubReceipts`,
      description,
      images: [logoUrl],
    },
    alternates: {
      canonical: `https://www.hubreceipts.com/email-receipt/${brand}`,
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

function EmailReceiptLoading() {
  return (
    <div className="brand-receipt-generator">
      <div className="brand-header">
        <h1>Loading..</h1>
      </div>
    </div>
  )
}

export default function EmailReceiptBrandPage({ params }: Props) {
  const brand = params.brand
  const brandData = brandsSchema.brands[brand]

  if (!brandData) {
    notFound()
  }

  const brandName = toLabel(brand)
  const logoUrl = `https://www.hubreceipts.com/brand-logos/${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webp`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${brandName} Email Receipt Generator`,
    description: `Create digital ${brandName} email receipts for orders with branded formatting.`,
    image: logoUrl,
    provider: {
      '@type': 'Organization',
      name: 'HubReceipts',
      url: 'https://www.hubreceipts.com',
    },
    areaServed: 'Worldwide',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="main">
        <div className="luxury-radial" aria-hidden />
        <Header />
        <Hero brandName={`${brandName} Email Receipt`} />

        <div style={{ width: '100%' }}>
          <Suspense fallback={<EmailReceiptLoading />}>
            <BrandReceiptGenerator
              preSelectedBrand={brand}
              title={`Generate Email Receipt ${brandName}`}
              headerTitle={`Create Email Receipt ${brandName}`}
            />
          </Suspense>
        </div>

        {/* SEO-rich unique content (~230 words) */}
        <section className="brand-seo-rich">
          <div className="brand-seo-inner">
            <h2>Create {brandName} email receipts that match brand formatting</h2>
            <p>
              Use this editor to assemble {brandName} email receipts that mirror the layout customers expect in
              their inbox: itemized lines, totals, taxes, and payment method, all wrapped with the correct
              logo sizing and spacing. Because the content is structured, your totals remain accurate across
              currencies, and you can localize fields for the region you send to. The generator is pre-loaded
              with {brandName} placeholders so you spend less time formatting and more time confirming details.
            </p>
            <p>
              Attach product photos or order screenshots, then export or send the receipt for confirmations,
              returns, or support flows. Data stays client-side while you edit, reducing exposure of order
              info. Popular brands for email receipts include Apple, Gucci, StockX, Nike, Flight Club, Louis
              Vuitton, Saint Laurent, and Trapstar, but the tool covers 100+ options with consistent results.
              Use it for warranty proofs, delivery confirmations, or to resend lost receipts with accurate
              branding and line items.
            </p>
            <ul>
              <li>Brand-correct headers and typography tailored to {brandName} email receipts.</li>
              <li>Currency-aware totals with optional tax rows for compliance.</li>
              <li>Downloadable PDF plus email-friendly formatting for quick forwarding.</li>
              <li>Mobile-ready editor so you can fix quantities or names on the go.</li>
              <li>Structured metadata to help search engines understand page relevance.</li>
            </ul>
            <p className="brand-links">
              Also see the <Link href={`/receipt/${brand}`}>PDF receipt template</Link>,{' '}
              <Link href={`/brands/${brand}`}>full generator</Link>, or browse <Link href="/brands">all brands</Link>.
            </p>
            <p>
              Enter your order data, verify amounts, and export. The output aims to look like a native
              {brandName} email receipt while keeping your details organized for customers, finance teams, or
              support agents who need clean proof of purchase.
            </p>
          </div>
        </section>
      </main>

      <style>{`
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

        .main {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          padding-top: 12px;
        }

        @media (max-width: 768px) {
          .brand-hero-title {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </>
  )
}

// Use dynamic rendering to avoid build timeout - no static generation
export const dynamic = 'force-dynamic'
export const dynamicParams = true
