import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'HubReceipts - Generate Authentic Receipts for 100+ Luxury & Streetwear Brands',
  description: 'Create realistic receipts for StockX, Louis Vuitton, Dior, Gucci, Nike, Supreme, Balenciaga, Off-White & 100+ premium brands. Professional receipt generator for luxury documentation and purchase verification.',
  metadataBase: new URL('https://hubreceipts.com'),
  
  openGraph: {
    title: 'HubReceipts - Professional Receipt Generator for Luxury Brands',
    description: 'Generate authentic receipts for 100+ luxury and streetwear brands. Create professional receipt templates instantly.',
    url: 'https://hubreceipts.com',
    siteName: 'HubReceipts',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HubReceipts - Professional Receipt Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'HubReceipts - Professional Receipt Generator',
    description: 'Generate authentic receipts for 100+ luxury and streetwear brands',
    images: ['/og-image.jpg'],
  },

  keywords: [
    // ... tus keywords existentes
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
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  category: 'ecommerce',
  classification: 'Receipt Generator Service',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* GOOGLE TAG (GTAG.JS) - ADD THIS */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17709466697"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17709466697');
          `}
        </Script>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hubreceipts.com" />

        {/* FAVICONS */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/android-chrome-192x192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/android-chrome-512x512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* THEME COLORS */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* ADDITIONAL OG TAGS */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="HubReceipts - Professional Receipt Generator for Luxury Brands" />
        
        {/* TWITTER ADDITIONAL TAGS */}
        <meta name="twitter:image:alt" content="HubReceipts - Generate authentic receipts for luxury brands" />

        {/* SCHEMA MARKUP */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite", 
              "name": "HubReceipts",
              "url": "https://hubreceipts.com",
              "description": "Professional receipt generator for 100+ luxury and streetwear brands",
              "thumbnailUrl": "https://hubreceipts.com/og-image.jpg",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://hubreceipts.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "HubReceipts",
              "url": "https://hubreceipts.com",
              "logo": "https://hubreceipts.com/hublogo.png",
              "description": "Professional receipt generator for luxury and streetwear brands",
              "sameAs": [],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "support@hubreceipts.com",
                "contactType": "customer service"
              }
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