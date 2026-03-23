import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'RepReceipts - Receipt Generator for 100+ Luxury & Streetwear Brands',
  description: 'Professional receipt generator for StockX, Louis Vuitton, Dior, Gucci, Nike, Supreme, Balenciaga & 100+ brands. Create receipt templates, email confirmations and order documentation instantly.',
  metadataBase: new URL('https://www.repsreceipt.com'),
  alternates: {
    canonical: '/',
  },
  
  openGraph: {
    title: 'RepReceipts - Receipt Generator for Luxury & Streetwear Brands',
    description: 'Professional receipt generator for 100+ luxury and streetwear brands. Create receipt templates, email confirmations and invoices instantly.',
    url: 'https://www.repsreceipt.com',
    siteName: 'RepReceipts',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RepReceipts - Professional Receipt Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'RepReceipts - Receipt Generator for 100+ Brands',
    description: 'Professional receipt generator for 100+ luxury and streetwear brands. Create templates, email confirmations and invoices.',
    images: ['/og-image.jpg'],
  },

  keywords: [
    'receipt generator',
    'luxury brand receipts',
    'invoice generator',
    'stockx receipt generator',
    'nike receipt generator',
    'louis vuitton receipt',
    'receipt maker',
    'receipt template',
    'email receipt generator',
    'professional receipt generator',
    'luxury fashion receipts',
    'streetwear receipt generator',
    'order confirmation generator',
    'purchase receipt creator'
  ],
  authors: [{ name: 'RepReceipts' }],
  creator: 'RepReceipts',
  publisher: 'RepReceipts',
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
  category: 'BusinessSoftware',
  classification: 'SaaS Receipt Generator',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GTM_ID = 'GTM-NDB93LDR'

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                (function(w,d,s,l,i){if(!w||!d||!d.getElementsByTagName)return;w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;if(f&&f.parentNode){f.parentNode.insertBefore(j,f);}
                })(window,document,'script','dataLayer','${GTM_ID}');
              } catch(e) {
                console.error('GTM initialization error:', e);
              }
            `,
          }}
        />

        {/* ✅ UPDATED GOOGLE TAG (GTAG.JS) - Deferred for performance */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17728207333"
          strategy="afterInteractive"
        />
        {/* Ahrefs Analytics - Deferred */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="D+3qURzx7DwG72aE6NMklA"
          strategy="afterInteractive"
        />
        <Script 
          id="google-analytics" 
          strategy="afterInteractive"
        >
          {`
            try {
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17728207333');
            } catch(e) {
              console.error('Google Analytics initialization error:', e);
            }
          `}
        </Script>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />

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
        <meta property="og:image:alt" content="RepReceipts - Professional Receipt Generator for Luxury Brands" />
        
        {/* TWITTER ADDITIONAL TAGS */}
        <meta name="twitter:image:alt" content="RepReceipts - Receipt Generator for Luxury Brands" />

        {/* ✅ SCHEMA MARKUP FOR SaaS */}

        {/* 1. Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite", 
              "name": "RepReceipts",
              "url": "https://www.repsreceipt.com",
              "description": "Professional receipt generator platform for 100+ luxury and streetwear brands",
              "thumbnailUrl": "https://www.repsreceipt.com/og-image.jpg",
              "potentialAction": {
                "@type": "ViewAction",
                "target": "https://www.repsreceipt.com/brands",
                "name": "Browse All Brands"
              }
            })
          }}
        />

        {/* 2. Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "RepReceipts",
              "url": "https://www.repsreceipt.com",
              "logo": "https://www.repsreceipt.com/logoreps.png",
              "description": "Professional receipt generation platform for luxury and streetwear brands",
              "sameAs": [],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "support@repsreceipt.com",
                "contactType": "customer service",
                "areaServed": "US",
                "availableLanguage": ["English", "Spanish", "French"]
              }
            })
          }}
        />

        {/* 3. SoftwareApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "RepReceipts Receipt Generator",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "permissions": "InternetConnection",
              "description": "Professional receipt generator platform for 100+ luxury and streetwear brands",
              "url": "https://www.repsreceipt.com",
              "image": "https://www.repsreceipt.com/og-image.jpg",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "priceValidUntil": "2027-12-31"
              },
              "author": {
                "@type": "Organization",
                "name": "RepReceipts"
              }
            })
          }}
        />

        {/* 4. Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "serviceType": "Digital Receipt Generation",
              "image": "https://www.repsreceipt.com/og-image.jpg",
              "provider": {
                "@type": "Organization",
                "name": "RepReceipts"
              },
              "areaServed": "Worldwide",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Receipt Generation Plans",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Free Receipt Generation",
                      "description": "Generate receipts with basic features"
                    },
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Premium Receipt Generation",
                      "description": "Generate receipts with advanced features and premium templates"
                    },
                    "price": "4.99",
                    "priceCurrency": "USD"
                  }
                ]
              }
            })
          }}
        />
      </head>
    <body>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-NDB93LDR"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
