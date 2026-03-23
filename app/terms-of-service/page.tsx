import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - RepReceipts',
  description: 'Terms of Service for RepReceipts receipt generator platform. Read our terms and conditions for using our service.',
  alternates: {
    canonical: '/terms-of-service',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', color: '#fff', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>Terms of Service</h1>
        <p style={{ color: '#888', marginBottom: '40px' }}>Last updated: March 23, 2026</p>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>1. Acceptance of Terms</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            By accessing and using RepReceipts (www.repsreceipt.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>2. Description of Service</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            RepReceipts provides an online receipt generator tool that creates receipt templates for various brands. The service is available in free and premium tiers. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>3. User Accounts</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>4. Acceptable Use</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc', marginBottom: '12px' }}>You agree to use RepReceipts only for lawful purposes. You may not use our service to:</p>
          <ul style={{ lineHeight: 1.9, color: '#ccc', paddingLeft: '20px' }}>
            <li>Create documents for fraudulent or illegal purposes</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the intellectual property rights of others</li>
            <li>Distribute malware or engage in any activity that harms our platform</li>
            <li>Attempt to gain unauthorized access to our systems</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>5. Intellectual Property</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            The RepReceipts platform, including its design, code, and content, is owned by RepReceipts. Brand logos and names used in receipt templates are trademarks of their respective owners and are used for identification purposes only.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>6. Payment and Subscriptions</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            Premium features require a paid subscription. Prices are displayed on our pricing page. Payments are processed securely through third-party payment processors. Refund requests are handled on a case-by-case basis.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>7. Limitation of Liability</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            RepReceipts is provided &quot;as is&quot; without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>8. Termination</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without notice, for conduct that we believe violates these terms or is harmful to other users or the service.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>9. Changes to Terms</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            We may update these Terms of Service at any time. Continued use of the service after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>10. Contact</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            For questions about these Terms of Service, contact us at <a href="mailto:support@repsreceipt.com" style={{ color: '#6C63FF', textDecoration: 'underline' }}>support@repsreceipt.com</a> or visit our <Link href="/contact" style={{ color: '#6C63FF', textDecoration: 'underline' }}>contact page</Link>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
