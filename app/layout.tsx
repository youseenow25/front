import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'Receipts StockX, Louis Vuitton, Dior +60 brands receipts.',
  description: 'Make receipts for StockX, Dior, Flannels, Apple',
  icons: {
    icon: [
      {
        url: '/hubogo.png',
        sizes: 'any',
      },
      {
        url: '/hubogo.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/hubogo.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/hubogo.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'android-chrome',
        url: '/hubogo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome',
        url: '/hubogo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HubReceipts',
  },
  // Open Graph Meta Tags (for social media)
  openGraph: {
    title: 'Receipts StockX, Louis Vuitton, Dior +60 brands receipts.',
    description: 'Make receipts for StockX, Dior, Flannels, Apple',
    images: [
      {
        url: '/hubogo.png',
        width: 1200,
        height: 630,
        alt: 'HubReceipts - Generate Fake Receipts',
      },
    ],
    url: 'https://hubreceipts.com',
    type: 'website',
  },
  // Twitter Card Meta Tags
  twitter: {
    card: 'summary_large_image',
    title: 'Receipts StockX, Louis Vuitton, Dior +60 brands receipts.',
    description: 'Make receipts for StockX, Dior, Flannels, Apple',
    images: ['/hubogo.png'],
  },
  // Additional SEO Meta Tags
  keywords: ['receipts', 'fake receipts', 'generator', 'stockx', 'dior', 'louis vuitton', 'apple', 'flannels'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for better SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hubreceipts.com" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}