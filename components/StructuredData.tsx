import brandsSchema from './brands'

function toLabel(name: string): string {
  const special: Record<string, string> = {
    zip_code: "ZIP Code",
    product_id: "Product ID",
    order_number: "Order Number",
    phone_number: "Phone Number",
    brand_name: "Brand Name",
    taxes_percentatge: "Taxes Percentatge",
    currency: "Currency",
  };
  if (special[name]) return special[name];
  return name
    .split("_")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default function StructuredData() {
  const brands = Object.keys(brandsSchema.brands || {})
  
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RepReceipts',
    url: 'https://www.repsreceipt.com',
    description: 'Professional receipt generator for luxury and streetwear brands. Create receipt templates instantly.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.repsreceipt.com/brands?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RepReceipts',
    url: 'https://www.repsreceipt.com',
    logo: 'https://www.repsreceipt.com/hublogo.png',
    description: 'Professional brand receipt generator for luxury brands and premium products.',
    sameAs: [
      'https://twitter.com/hubreceipts',
      'https://facebook.com/hubreceipts'
    ]
  }

  // CHANGE THIS: Use "Service" instead of "Product"
  const brandStructuredData = brands.map((brand) => ({
    '@context': 'https://schema.org',
    '@type': 'Service', // ✅ CHANGED FROM "Product" TO "Service"
    name: `${toLabel(brand)} Receipt Generator`,
    description: `${toLabel(brand)} receipt generator with brand-specific formatting. Create professional ${toLabel(brand)} receipt templates and invoices.`,
    provider: {
      '@type': 'Organization',
      name: 'RepReceipts'
    },
    serviceType: 'Receipt Generation',
    areaServed: 'Worldwide',
    offers: {
      '@type': 'Offer',
      url: `https://www.repsreceipt.com/brands/${brand}`,
      price: '0',
      priceCurrency: 'USD'
    }
    // Remove aggregateRating unless you actually have reviews
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      {brandStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  )
}