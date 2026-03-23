import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us - RepReceipts Support',
  description: 'Get in touch with the RepReceipts team. Contact us for support, brand requests, business inquiries, or feedback about our receipt generator platform.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact RepReceipts',
    description: 'Get in touch with the RepReceipts team for support, brand requests, or business inquiries.',
    url: 'https://www.repsreceipt.com/contact',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', color: '#fff', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '24px' }}>Contact Us</h1>

        <section style={{ marginBottom: '40px' }}>
          <p style={{ lineHeight: 1.7, marginBottom: '24px', color: '#ccc' }}>
            Have a question, suggestion, or need help with RepReceipts? We are happy to hear from you. Reach out using any of the methods below.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Email Support</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            For general inquiries, support requests, or feedback:<br />
            <a href="mailto:support@repsreceipt.com" style={{ color: '#6C63FF', textDecoration: 'underline' }}>support@repsreceipt.com</a>
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Brand Requests</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            Want us to add a new brand to our receipt generator? Send us the brand name and any relevant details to our email and we will work on adding it to the platform.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Business Inquiries</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            For partnerships, API access, or enterprise receipt generation solutions, contact us at our support email with the subject line &quot;Business Inquiry&quot;.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Response Time</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            We typically respond within 24-48 hours. For urgent issues with your account or receipts, please include your account email in your message.
          </p>
        </section>

        <section>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            You can also browse our <Link href="/brands" style={{ color: '#6C63FF', textDecoration: 'underline' }}>brand directory</Link> or check our <Link href="/about" style={{ color: '#6C63FF', textDecoration: 'underline' }}>about page</Link> to learn more about RepReceipts.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
