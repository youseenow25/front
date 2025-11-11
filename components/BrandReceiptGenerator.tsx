"use client";
import React, { useEffect } from 'react';
import ImageUploader from './ImageUploaderSeo';

interface BrandReceiptGeneratorProps {
  preSelectedBrand: string;
}

export default function BrandReceiptGenerator({ preSelectedBrand }: BrandReceiptGeneratorProps) {
  useEffect(() => {
    // Update page title dynamically
    const brandLabel = toLabel(preSelectedBrand);
    document.title = `${brandLabel} Receipt Generator - Create Authentic ${brandLabel} Receipts | HubReceipts`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Generate authentic ${brandLabel} receipts instantly. Create professional ${brandLabel} invoice templates with official designs and formatting. Free ${brandLabel} receipt maker.`
      );
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://hubreceipts.com/brands/${preSelectedBrand}`);
  }, [preSelectedBrand]);

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

  return (
    <div className="brand-receipt-generator">
      <div className="brand-header">
        <h1>{toLabel(preSelectedBrand)} Receipt Generator</h1>
        <p className="brand-subtitle">
          Create authentic {toLabel(preSelectedBrand)} receipts with official designs and formatting. 
          Generate professional {toLabel(preSelectedBrand)} invoice templates instantly.
        </p>
        <div className="brand-features">
          <span className="feature-badge">✓ Official {toLabel(preSelectedBrand)} Designs</span>
          <span className="feature-badge">✓ Instant Generation</span>
          <span className="feature-badge">✓ Free to Use</span>
        </div>
      </div>
      
      <ImageUploader preSelectedBrand={preSelectedBrand} isBrandPage={true} />
      
      <div className="brand-seo-content">
        <h2>Create Professional {toLabel(preSelectedBrand)} Receipts</h2>
        <p>
          Our {toLabel(preSelectedBrand)} receipt generator allows you to create authentic-looking 
          {toLabel(preSelectedBrand)} receipts for your purchases, returns, or business records. 
          Whether you need a {toLabel(preSelectedBrand)} invoice for accounting purposes or a 
          receipt for personal records, our tool provides the most accurate and professional 
          {toLabel(preSelectedBrand)} receipt templates available online.
        </p>
        
        <h3>Why Use Our {toLabel(preSelectedBrand)} Receipt Maker?</h3>
        <ul>
          <li><strong>Authentic Designs:</strong> Pixel-perfect replicas of real {toLabel(preSelectedBrand)} receipt layouts</li>
          <li><strong>Multiple Currencies:</strong> Support for USD, EUR, GBP, and more</li>
          <li><strong>Multi-language:</strong> Generate receipts in English, French, German, and other languages</li>
          <li><strong>Instant Delivery:</strong> Receipts sent directly to your email</li>
          <li><strong>Mobile Friendly:</strong> Works perfectly on all devices</li>
        </ul>
        
        <h3>How to Generate Your {toLabel(preSelectedBrand)} Receipt</h3>
        <ol>
          <li>Upload your product image (optional but recommended)</li>
          <li>Fill in the required {toLabel(preSelectedBrand)} receipt fields</li>
          <li>Select your preferred currency and language</li>
          <li>Enter your email address for delivery</li>
          <li>Click "Generate {toLabel(preSelectedBrand)} Receipt"</li>
        </ol>
      </div>

      <style jsx>{`
        .brand-receipt-generator {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .brand-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 16px;
          border: 1px solid #e9ecef;
        }
        
        .brand-header h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #d4af37, #c9b037);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .brand-subtitle {
          font-size: 1.2rem;
          color: #666;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto 24px;
        }
        
        .brand-features {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .feature-badge {
          background: #e8f5e8;
          color: #2e7d32;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
          border: 1px solid #c8e6c9;
        }
        
        .brand-seo-content {
          margin-top: 60px;
          padding: 40px;
          background: #f8f9fa;
          border-radius: 12px;
          line-height: 1.7;
        }
        
        .brand-seo-content h2 {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #333;
        }
        
        .brand-seo-content h3 {
          font-size: 1.5rem;
          margin: 30px 0 15px;
          color: #444;
        }
        
        .brand-seo-content p {
          margin-bottom: 20px;
          color: #666;
          font-size: 1.1rem;
        }
        
        .brand-seo-content ul, .brand-seo-content ol {
          margin-bottom: 20px;
          padding-left: 24px;
        }
        
        .brand-seo-content li {
          margin-bottom: 8px;
          color: #666;
        }
        
        @media (max-width: 768px) {
          .brand-header h1 {
            font-size: 2.2rem;
          }
          
          .brand-subtitle {
            font-size: 1.1rem;
          }
          
          .brand-features {
            flex-direction: column;
            align-items: center;
          }
          
          .brand-seo-content {
            padding: 24px;
            margin-top: 40px;
          }
          
          .brand-seo-content h2 {
            font-size: 1.75rem;
          }
          
          .brand-seo-content h3 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}