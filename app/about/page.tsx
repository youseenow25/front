import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About RepReceipts - Professional Receipt Generator Platform',
  description: 'RepReceipts is a professional receipt generator platform supporting 100+ luxury and streetwear brands. Learn about our mission, features, and how we help businesses create professional receipts.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About RepReceipts - Receipt Generator Platform',
    description: 'Learn about RepReceipts, the professional receipt generator for 100+ luxury and streetwear brands.',
    url: 'https://www.repsreceipt.com/about',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', color: '#fff', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '24px' }}>About RepReceipts</h1>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>What We Do</h2>
          <p style={{ lineHeight: 1.7, marginBottom: '16px', color: '#ccc' }}>
            RepReceipts is a professional receipt generation platform that helps users create branded receipt templates for over 100 luxury and streetwear brands. Our tool generates receipt templates with accurate brand formatting, logos, and layout structures used by major retailers worldwide.
          </p>
          <p style={{ lineHeight: 1.7, marginBottom: '16px', color: '#ccc' }}>
            Whether you need receipt templates for business documentation, design mockups, e-commerce prototyping, or personal record keeping, RepReceipts provides instant, professional-quality output.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Supported Brands</h2>
          <p style={{ lineHeight: 1.7, marginBottom: '16px', color: '#ccc' }}>
            We support receipt templates for leading brands including Nike, Adidas, Louis Vuitton, Gucci, Dior, Balenciaga, StockX, Supreme, Apple, Chanel, Prada, Moncler, and many more. Each template is designed to reflect the actual formatting and style used by these retailers.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Key Features</h2>
          <ul style={{ lineHeight: 1.9, color: '#ccc', paddingLeft: '20px' }}>
            <li>Receipt templates for 100+ luxury and streetwear brands</li>
            <li>Email receipt and order confirmation formats</li>
            <li>PDF and printable receipt export</li>
            <li>Multi-currency support for international formatting</li>
            <li>Mobile-friendly generator that works on any device</li>
            <li>Instant generation with no software installation required</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Our Mission</h2>
          <p style={{ lineHeight: 1.7, marginBottom: '16px', color: '#ccc' }}>
            We aim to be the most comprehensive and easy-to-use receipt generator on the web. Our platform is built with modern web technologies and continuously updated with new brands and improved templates.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Get Started</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            Browse our <Link href="/brands" style={{ color: '#6C63FF', textDecoration: 'underline' }}>full brand directory</Link> to find your brand and start generating receipts instantly. Have questions? Visit our <Link href="/contact" style={{ color: '#6C63FF', textDecoration: 'underline' }}>contact page</Link>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
