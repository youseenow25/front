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
    name: 'HubReceipts',
    url: 'https://www.hubreceipts.com',
    description: 'Generate authentic brand receipts instantly. Create professional receipt templates for luxury brands.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.hubreceipts.com/brands?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HubReceipts',
    url: 'https://www.hubreceipts.com',
    logo: 'https://www.hubreceipts.com/hublogo.png',
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
    description: `Generate authentic ${toLabel(brand)} receipts with official designs and formatting. Create professional ${toLabel(brand)} invoice templates instantly.`,
    provider: {
      '@type': 'Organization',
      name: 'HubReceipts'
    },
    serviceType: 'Receipt Generation',
    areaServed: 'Worldwide',
    offers: {
      '@type': 'Offer',
      url: `https://www.hubreceipts.com/brands/${brand}`,
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