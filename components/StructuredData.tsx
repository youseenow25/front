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
    url: 'https://hubreceipts.com',
    description: 'Generate authentic brand receipts instantly. Create professional receipt templates for luxury brands.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://hubreceipts.com/brands?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HubReceipts',
    url: 'https://hubreceipts.com',
    logo: 'https://hubreceipts.com/logo.png',
    description: 'Professional brand receipt generator for luxury brands and premium products.',
    sameAs: [
      'https://twitter.com/hubreceipts',
      'https://facebook.com/hubreceipts'
    ]
  }

  const brandStructuredData = brands.map((brand) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${toLabel(brand)} Receipt Generator`,
    description: `Generate authentic ${toLabel(brand)} receipts with official designs and formatting. Create professional ${toLabel(brand)} invoice templates instantly.`,
    brand: {
      '@type': 'Brand',
      name: toLabel(brand)
    },
    offers: {
      '@type': 'Offer',
      url: `https://hubreceipts.com/brands/${brand}`,
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150'
    }
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