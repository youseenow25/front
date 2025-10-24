import type { Metadata } from 'next'
import './globals.css'

import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
title: 'HubReceipts — Stock, Louis Vuitton, Dior +60 brands receipts.',
description: 'Make receipts for StockX,Dior, Flannels, Apple'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
{children}
 <Analytics />
</body>
</html>
)
}