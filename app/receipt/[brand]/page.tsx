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
  const description = `Generate downloadable ${brandName} receipt templates with authentic formatting and fields.`
  const logoUrl = `https://www.hubreceipts.com/brand-logos/${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webp`

  return {
    title: `${brandName} receipt template`,
    description,
    keywords: [
      `${brandName} receipt template`,
      `${brandName} receipt download`,
      `${brandName} invoice template`,
      `${brandName} receipt maker`,
      `${brandName} PDF receipt`,
      'free receipt generator',
      'luxury receipt template',
    ],
    openGraph: {
      title: `${brandName} receipt template`,
      description,
      type: 'website',
      locale: 'en_US',
      url: `https://www.hubreceipts.com/receipt/${brand}`,
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
      title: `${brandName} Receipt Template - HubReceipts`,
      description,
      images: [logoUrl],
    },
    alternates: {
      canonical: `https://www.hubreceipts.com/receipt/${brand}`,
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
  const logoUrl = `https://www.hubreceipts.com/brand-logos/${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webp`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${brandName} Receipt Template Generator`,
    description: `Create ${brandName} receipt templates that match brand formatting and export instantly.`,
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

        {/* SEO-rich unique content (~230 words) */}
        <section className="brand-seo-rich">
          <div className="brand-seo-inner">
            <h2>{brandName} receipt templates ready for print or PDF export</h2>
            <p>
              This {brandName} receipt template page is tuned for authenticity: line spacing, logo sizing, and
              common receipt fields are pre-configured so you don&apos;t start from a blank canvas. Enter item
              details, taxes, payment method, and store info to mirror what customers normally receive in
              their inbox or at checkout. Because values are structured, totals and tax amounts stay aligned
              across currencies, and you can localize the text to match your region.
            </p>
            <p>
              Add product images or order screenshots for your records, then download a crisp PDF you can file
              with accounting tools or share as proof of purchase. The editor stays client-side until you
              export, so sensitive order data is not exposed while you adjust numbers. Frequent use cases
              include warranty claims, expense submissions, lost-receipt replacements, and reconciling
              returns. Brands users generate most here include Apple, Gucci, StockX, Nike, Flight Club, Louis
              Vuitton, Saint Laurent, and Trapstar, but we support 100+ templates.
            </p>
            <ul>
              <li>Brand-correct logo placement and typography for {brandName} receipts.</li>
              <li>Currency-aware subtotals and tax rows that stay aligned when printed.</li>
              <li>Optional email delivery plus instant PDF download for quick sharing.</li>
              <li>Mobile-friendly fields so you can edit quantities or names on the go.</li>
              <li>Structured data baked into the page for better indexing and relevance.</li>
            </ul>
            <p className="brand-links">
              Need other formats? Try the <Link href={`/email-receipt/${brand}`}>email receipt version</Link>, the{' '}
              <Link href={`/brands/${brand}`}>interactive generator</Link>, or browse <Link href="/brands">all brands</Link>.
            </p>
            <p>
              Fill the fields, verify totals, and export. The goal is a professional {brandName} receipt
              template that balances brand accuracy with clear line items and tax detail, ready for
              customers, finance teams, or support agents who need proof of purchase.
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

export async function generateStaticParams() {
  const brands = Object.keys(brandsSchema.brands || {})

  return brands.map((brand) => ({
    brand,
  }))
}

export const revalidate = 86400
