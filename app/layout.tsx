import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'Receipts StockX, Louis Vuitton, Dior +60 brands receipts.',
  description: 'Make receipts for StockX, Dior, Flannels, Apple',
  icons: {
    icon: [
      {
        url: '/hublogo.png',
        sizes: 'any',
      },
      {
        url: '/hublogo.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/hublogo.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/hublogo.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'android-chrome',
        url: '/hublogo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome',
        url: '/hublogo.png',
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
  openGraph: {
    title: 'Receipts StockX, Louis Vuitton, Dior +60 brands receipts.',
    description: 'Make receipts for StockX, Dior, Flannels, Apple',
    images: [
      {
        url: '/hublogo.png', // Make sure this file exists
        width: 1200,
        height: 630,
        alt: 'HubReceipts - Generate Fake Receipts',
      },
    ],
    url: 'https://hubreceipts.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Receipts StockX, Louis Vuitton, Dior +60 brands receipts.',
    description: 'Make receipts for StockX, Dior, Flannels, Apple',
    images: ['/hublogo.png'], // Make sure this file exists
  },
  keywords: ['receipts', 'fake receipts', 'generator', 'stockx', 'dior', 'louis vuitton', 'apple', 'flannels'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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