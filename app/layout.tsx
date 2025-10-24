import type { Metadata } from 'next'
import './globals.css'

import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
title: 'Flux — The #1 Automation Toolkit',
description: 'Generate reports, orchestrate emulators, and access the complete reseller toolkit. Turn small ops into 10x outcomes.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
{children}
</body>
</html>
)
}