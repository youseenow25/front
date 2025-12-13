import type { Metadata } from 'next'

// Force dynamic rendering to prevent build timeout (client component pages need this)
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children
}
