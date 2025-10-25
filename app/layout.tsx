import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'HubReceipts - Generate Authentic Receipts for 60+ Luxury Brands',
  description: 'Create realistic receipts for StockX, Louis Vuitton, Dior, Gucci, Apple, Nike, Supreme & 60+ premium brands. Professional receipt generator for luxury documentation.',
  metadataBase: new URL('https://hubreceipts.com'),
  keywords: [
    // Primary keywords
    'fake receipts',
    'receipt generator',
    'luxury receipts',
    'receipt maker',
    
    // Brand-specific receipt keywords
    'stockx receipt',
    'stockx receipt generator',
    'louis vuitton receipt',
    'dior receipt',
    'gucci receipt',
    'apple receipt',
    'nike receipt',
    'supreme receipt',
    'flannels receipt',
    'dyson receipt',
    'trapstar receipt',
    'off white receipt',
    'balenciaga receipt',
    'supreme receipt generator',
    'bape receipt',
    'stone island receipt',
    'moncler receipt',
    'chrome hearts receipt',
    
    // Store receipts
    'selfridges receipt',
    'harrods receipt',
    'ssense receipt',
    'farfetch receipt',
    'goat receipt',
    'flight club receipt',
    
    // Category keywords
    'luxury brand receipts',
    'premium receipts',
    'authentic receipts',
    'receipt documentation',
    'purchase verification',
    
    'online receipt generator',
    'digital receipts',
    'receipt template',
    
    // Action keywords
    'generate receipt',
    'create receipt',
    'make receipt online',
    'receipt creator',
    'custom receipt maker'
  ],
  authors: [{ name: 'HubReceipts' }],
  creator: 'HubReceipts',
  publisher: 'HubReceipts',
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
  icons: {
    icon: '/hublogo.png',
    apple: '/hublogo.png',
    shortcut: '/hublogo.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HubReceipts',
  },
  
  // Open Graph for social media
  openGraph: {
    title: 'HubReceipts - Generate Authentic Receipts for 60+ Luxury Brands',
    description: 'Create realistic receipts for StockX, Louis Vuitton, Dior, Gucci, Apple & 60+ premium brands. Professional receipt documentation.',
    url: 'https://hubreceipts.com',
    siteName: 'HubReceipts',
    images: [
      {
        url: '/hublogo.png',
        width: 1200,
        height: 630,
        alt: 'HubReceipts - Professional Receipt Generator for Luxury Brands',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'HubReceipts - Luxury Brand Receipt Generator',
    description: 'Generate authentic receipts for StockX, LV, Dior, Gucci & 60+ brands',
    images: ['/hublogo.png'],
    creator: '@hubreceipts',
  },
  
  // Additional SEO enhancements
  alternates: {
    canonical: 'https://hubreceipts.com',
  },
  category: 'ecommerce',
  classification: 'Receipt Generator Service',
  
  // Structured data hints
  other: {
    'google-site-verification': 'your-google-verification-code', // Add when available
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hubreceipts.com" />
        
        {/* Explicit favicon links for maximum compatibility */}
        <link rel="icon" type="image/png" href="/hublogo.png" />
        <link rel="apple-touch-icon" href="/hublogo.png" />
        <link rel="shortcut icon" href="/hublogo.png" />
        
        {/* Additional meta tags for receipt-specific SEO */}
        <meta name="application-name" content="HubReceipts" />
        <meta name="apple-mobile-web-app-title" content="HubReceipts" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Schema.org structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "HubReceipts",
              "description": "Professional receipt generator for luxury brands including StockX, Louis Vuitton, Dior, Gucci and 60+ premium brands",
              "url": "https://hubreceipts.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "permissions": "browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "HubReceipts"
              },
              "keywords": "receipt generator, fake receipts, luxury brand receipts, stockx receipt, louis vuitton receipt, dior receipt"
            })
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}