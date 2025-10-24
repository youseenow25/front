export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "HubReceipts",
    "description": "Professional luxury receipt generator for StockX, Louis Vuitton, Dior and 60+ brands",
    "serviceType": "Receipt Generation",
    "areaServed": "Worldwide",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://yourdomain.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}