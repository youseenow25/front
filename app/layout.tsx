import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'HubReceipts - Generate Authentic Receipts for 100+ Luxury & Streetwear Brands',
  description: 'Create realistic receipts for StockX, Louis Vuitton, Dior, Gucci, Nike, Supreme, Balenciaga, Off-White & 100+ premium brands. Professional receipt generator for luxury documentation and purchase verification.',
  metadataBase: new URL('https://hubreceipts.com'),
  keywords: [
    // Primary keywords
    'fake receipts',
    'receipt generator',
    'luxury receipts',
    'receipt maker',
    'online receipt generator',
    'digital receipts',
    'receipt template',
    'generate receipt',
    'create receipt',
    'make receipt online',
    'receipt creator',
    'custom receipt maker',
    'purchase verification',
    'receipt documentation',
    
    // Luxury Fashion Brands
    'louis vuitton receipt',
    'dior receipt',
    'gucci receipt',
    'balenciaga receipt',
    'chanel receipt',
    'prada receipt',
    'hermes receipt',
    'celine receipt',
    'fendi receipt',
    'givenchy receipt',
    'versace receipt',
    'dolce gabbana receipt',
    'bottega veneta receipt',
    'valentino receipt',
    'burberry receipt',
    'loewe receipt',
    'cartier receipt',
    'bulgari receipt',
    'tiffany receipt',
    'van cleef arpels receipt',
    
    // Streetwear Brands
    'supreme receipt',
    'bape receipt',
    'off white receipt',
    'stone island receipt',
    'palace receipt',
    'kith receipt',
    'stussy receipt',
    'carhartt receipt',
    'vetements receipt',
    'alyx receipt',
    'ambush receipt',
    'human made receipt',
    'noah receipt',
    'brain dead receipt',
    
    // Sneaker & Sportswear Brands
    'nike receipt',
    'adidas receipt',
    'jordan receipt',
    'yeezy receipt',
    'new balance receipt',
    'puma receipt',
    'reebok receipt',
    'converse receipt',
    'vans receipt',
    'asics receipt',
    'saucony receipt',
    
    // High-End Streetwear & Designer
    'acne studios receipt',
    'corteiz receipt',
    'denim tears receipt',
    'gallery dept receipt',
    'broken planet receipt',
    'trapstar receipt',
    'pop mort receipt',
    'yeezy gap receipt',
    'vivienne westwood receipt',
    'maison margiela receipt',
    'rick owens receipt',
    'yohji yamamoto receipt',
    'comme des garcons receipt',
    
    // Marketplaces & Resellers
    'stockx receipt',
    'goat receipt',
    'grailed receipt',
    'depop receipt',
    'ebay receipt',
    'vinted receipt',
    'farfetch receipt',
    'ssense receipt',
    'end receipt',
    'cettire receipt',
    
    // Department Stores & Retailers
    'selfridges receipt',
    'harrods receipt',
    'flannels receipt',
    'nordstrom receipt',
    'neiman marcus receipt',
    'saks fifth avenue receipt',
    'barneys receipt',
    'bloomingdales receipt',
    'macy receipt',
    'john lewis receipt',
    'de bijenkorf receipt',
    'breuninger receipt',
    'frasers receipt',
    'zalando receipt',
    
    // Specialty Stores
    'jd sports receipt',
    'foot locker receipt',
    'stadium goods receipt',
    'flight club receipt',
    'kith receipt',
    'a ma maniere receipt',
    'sneakersnstuff receipt',
    'size receipt',
    
    // Luxury Goods & Jewelry
    'rolex receipt',
    'omega receipt',
    'patek philippe receipt',
    'audemars piguet receipt',
    'breitling receipt',
    'tag heuer receipt',
    'cartier receipt',
    'tiffany receipt',
    'bulgari receipt',
    'van cleef receipt',
    'xerjoff receipt',
    'creed receipt',
    'tom ford receipt',
    
    // Electronics & Home
    'apple receipt',
    'dyson receipt',
    'sony receipt',
    'samsung receipt',
    'bose receipt',
    'bang olufsen receipt',
    'nest receipt',
    'ring receipt',
    
    // Outdoor & Sport
    'arcteryx receipt',
    'patagonia receipt',
    'the north face receipt',
    'columbia receipt',
    'canada goose receipt',
    'moncler receipt',
    'woolrich receipt',
    'barbour receipt',
    
    // Vintage & Secondhand
    'the realreal receipt',
    'vestiaire collective receipt',
    'rebag receipt',
    'fashionphile receipt',
    'what goes around comes around receipt',
    
    // Additional Brands from your list
    'culture kings receipt',
    'loro piana receipt',
    'stanley receipt',
    'argos receipt',
    'best secret receipt',
    'boots receipt',
    'pacsun receipt',
    'taylor made golf receipt',
    'ugg receipt',
    'sephora receipt',
    'chrono24 receipt',
    'sp5der receipt',
    
    // Category-specific keywords
    'luxury brand receipts',
    'designer receipts',
    'streetwear receipts',
    'sneaker receipts',
    'high fashion receipts',
    'premium receipts',
    'authentic receipts',
    'receipt documentation',
    'purchase verification',
    'fake purchase receipts',
    'online receipt generator',
    'digital receipts',
    'receipt template'
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
  
  // PROPER FAVICON CONFIGURATION
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  
  manifest: '/site.webmanifest',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HubReceipts',
  },
  
  // Open Graph - Use a different image for social media
  openGraph: {
    title: 'HubReceipts - Generate Authentic Receipts for 100+ Luxury & Streetwear Brands',
    description: 'Create realistic receipts for StockX, Louis Vuitton, Dior, Gucci, Nike, Supreme, Balenciaga & 100+ premium brands. Professional receipt documentation.',
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
  
  twitter: {
    card: 'summary_large_image',
    title: 'HubReceipts - Luxury & Streetwear Receipt Generator',
    description: 'Generate authentic receipts for 100+ brands including StockX, LV, Dior, Gucci, Nike, Supreme',
    images: ['/hublogo.png'],
    creator: '@hubreceipts',
  },
  
  alternates: {
    canonical: 'https://hubreceipts.com',
  },
  category: 'ecommerce',
  classification: 'Receipt Generator Service',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hubreceipts.com" />
        
        {/* EXPLICIT FAVICON LINKS AS FALLBACK */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Additional meta tags */}
        <meta name="application-name" content="HubReceipts" />
        <meta name="apple-mobile-web-app-title" content="HubReceipts" />
        <meta name="msapplication-TileColor" content="#000000" />
        
        {/* Comprehensive Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "HubReceipts",
              "description": "Professional receipt generator for 100+ luxury and streetwear brands including StockX, Louis Vuitton, Dior, Gucci, Nike, Supreme, Balenciaga, Off-White and premium retailers",
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
                "name": "HubReceipts",
                "url": "https://hubreceipts.com"
              },
              "keywords": [
                "fake receipts", "receipt generator", "luxury receipts", "stockx receipt", 
                "louis vuitton receipt", "dior receipt", "gucci receipt", "nike receipt",
                "supreme receipt", "balenciaga receipt", "off white receipt", "adidas receipt",
                "bape receipt", "stone island receipt", "apple receipt", "dyson receipt",
                "farfetch receipt", "ssense receipt", "selfridges receipt", "harrods receipt"
              ],
              "mainEntity": {
                "@type": "ItemList",
                "name": "Supported Brands",
                "numberOfItems": 100,
                "itemListElement": [
                  {"@type": "ListItem", "position": 1, "name": "StockX"},
                  {"@type": "ListItem", "position": 2, "name": "Louis Vuitton"},
                  {"@type": "ListItem", "position": 3, "name": "Dior"},
                  {"@type": "ListItem", "position": 4, "name": "Gucci"},
                  {"@type": "ListItem", "position": 5, "name": "Nike"},
                  {"@type": "ListItem", "position": 6, "name": "Supreme"},
                  {"@type": "ListItem", "position": 7, "name": "Balenciaga"},
                  {"@type": "ListItem", "position": 8, "name": "Off-White"},
                  {"@type": "ListItem", "position": 9, "name": "Adidas"},
                  {"@type": "ListItem", "position": 10, "name": "Apple"}
                ]
              }
            })
          }}
        />
        
        {/* Additional schema for local business */}
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