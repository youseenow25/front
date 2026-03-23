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
      title: 'Brand Not Found - RepReceipts',
    }
  }

  const brandName = toLabel(brand)
  const description = `Download ${brandName} receipt templates as PDF. Professional ${brandName} receipt maker with brand formatting, itemized lines, and print-ready export.`
  const logoUrl = `https://www.repsreceipt.com/brand-logos/${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webp`

  return {
    title: `${brandName} Receipt Template - Download PDF | RepReceipts`,
    description,
    keywords: [
      `${brandName} receipt template`,
      `${brandName} receipt download`,
      `${brandName} receipt PDF`,
      `${brandName} printable receipt`,
      `${brandName} invoice template`,
      'receipt template download',
      'PDF receipt generator',
    ],
    openGraph: {
      title: `${brandName} Receipt Template - Download PDF | RepReceipts`,
      description,
      type: 'website',
      locale: 'en_US',
      url: `https://www.repsreceipt.com/receipt/${brand}`,
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
      title: `${brandName} Receipt Template - RepReceipts`,
      description,
      images: [logoUrl],
    },
    alternates: {
      canonical: `https://www.repsreceipt.com/receipt/${brand}`,
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

function ReceiptPageLoading() {
  return (
    <div className="brand-receipt-generator">
      <div className="brand-header">
        <h1>Loading...</h1>
      </div>
    </div>
  )
}

export default function ReceiptBrandPage({ params }: Props) {
  const brand = params.brand
  const brandData = brandsSchema.brands[brand]

  if (!brandData) {
    notFound()
  }

  const brandName = toLabel(brand)
  const logoUrl = `https://www.repsreceipt.com/brand-logos/${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webp`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${brandName} Receipt Template Generator`,
    description: `Create ${brandName} receipt templates that match brand formatting and export instantly.`,
    image: logoUrl,
    provider: {
      '@type': 'Organization',
      name: 'RepReceipts',
      url: 'https://www.repsreceipt.com',
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
        <Hero brandName={`${brandName} Receipt Template`} />

        <div style={{ width: '100%' }}>
          <Suspense fallback={<ReceiptPageLoading />}>
            <BrandReceiptGenerator
              preSelectedBrand={brand}
              title={`Receipt Template ${brandName}`}
              headerTitle={`Receipt Template ${brandName}`}
            />
          </Suspense>
        </div>

        {/* SEO content - focused on PDF/print receipt templates */}
        <section className="brand-seo-rich">
          <div className="brand-seo-inner">
            <h2>Download {brandName} Receipt Templates as PDF</h2>
            <p>
              This page provides downloadable {brandName} receipt templates formatted for printing and PDF export.
              Unlike generic invoice tools, each template uses {brandName}-specific layout structures including
              correct logo placement, font styling, and field arrangement. Fill in your order details — items,
              prices, taxes, payment method — and download a print-ready PDF instantly.
            </p>

            <h3>PDF Receipt Features</h3>
            <p>
              The {brandName} PDF template supports multiple line items with individual pricing, automatic
              subtotal and tax calculation, and customizable store location details. Receipts export at
              standard print resolution so they look sharp on paper or when attached to digital documents.
              You can generate receipts in any supported currency with regional tax formatting.
            </p>

            <h3>Common Uses for {brandName} Receipt Templates</h3>
            <ul>
              <li>Expense report documentation with itemized purchase details.</li>
              <li>Record keeping for warranty registration and product returns.</li>
              <li>Business accounting and purchase order reconciliation.</li>
              <li>Print-ready format optimized for A4 and letter paper sizes.</li>
            </ul>

            <p className="brand-links">
              Other {brandName} tools: <Link href={`/brands/${brand}`}>{brandName} receipt generator</Link> ·{' '}
              <Link href={`/email-receipt/${brand}`}>{brandName} email receipt</Link> ·{' '}
              <Link href="/brands">all brands</Link> ·{' '}
              <Link href="/about">about us</Link>
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

// Generate all receipt pages at build time for Google indexing
export async function generateStaticParams() {
  const brands = Object.keys(brandsSchema.brands || {})
  return brands.map((brand) => ({ brand }))
}

// Revalidate every 24 hours instead of force-dynamic
export const revalidate = 86400
export const dynamicParams = true
