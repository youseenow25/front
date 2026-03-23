import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - RepReceipts',
  description: 'RepReceipts privacy policy. Learn how we collect, use, and protect your personal information when using our receipt generator platform.',
  alternates: {
    canonical: '/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', color: '#fff', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: '#888', marginBottom: '40px' }}>Last updated: March 23, 2026</p>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>1. Introduction</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            RepReceipts (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website www.repsreceipt.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our receipt generator services.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>2. Information We Collect</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc', marginBottom: '12px' }}>We may collect the following types of information:</p>
          <ul style={{ lineHeight: 1.9, color: '#ccc', paddingLeft: '20px' }}>
            <li><strong>Account Information:</strong> Email address and name when you create an account or sign in with Google.</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, browser type, device information, and IP address.</li>
            <li><strong>Receipt Data:</strong> Information you enter into receipt templates. This data is processed on our servers to generate your receipts.</li>
            <li><strong>Payment Information:</strong> Payment details are processed securely through our third-party payment processor. We do not store credit card numbers.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>3. How We Use Your Information</h2>
          <ul style={{ lineHeight: 1.9, color: '#ccc', paddingLeft: '20px' }}>
            <li>To provide and maintain our receipt generator service</li>
            <li>To process your account registration and manage your subscription</li>
            <li>To improve our website, features, and user experience</li>
            <li>To communicate with you about updates, support, and service-related notices</li>
            <li>To detect and prevent fraud or abuse</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>4. Cookies and Tracking</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            We use cookies and similar tracking technologies (Google Analytics, Google Tag Manager) to analyze website traffic and improve user experience. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>5. Third-Party Services</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            We use third-party services including Google Analytics, Google Tag Manager, Vercel Analytics, and Ahrefs for website analytics. These services may collect information about your browsing behavior. Each service operates under its own privacy policy.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>6. Data Security</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>7. Data Retention</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>8. Your Rights</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc', marginBottom: '12px' }}>Depending on your jurisdiction, you may have the right to:</p>
          <ul style={{ lineHeight: 1.9, color: '#ccc', paddingLeft: '20px' }}>
            <li>Access and receive a copy of your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>9. Changes to This Policy</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>10. Contact Us</h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>
            If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@repsreceipt.com" style={{ color: '#6C63FF', textDecoration: 'underline' }}>support@repsreceipt.com</a> or visit our <Link href="/contact" style={{ color: '#6C63FF', textDecoration: 'underline' }}>contact page</Link>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
