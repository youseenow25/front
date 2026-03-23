"use client";
import React from 'react';
import ImageUploader from './ImageUploaderSeo';

interface BrandReceiptGeneratorProps {
  preSelectedBrand: string;
  title?: string;
  headerTitle?: string;
}

export default function BrandReceiptGenerator({ preSelectedBrand, title, headerTitle }: BrandReceiptGeneratorProps) {
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
      {/* ImageUploader comes first */}
      <ImageUploader
        preSelectedBrand={preSelectedBrand}
        isBrandPage={true}
        title={headerTitle}
      />
      
      {/* SEO Content comes below ImageUploader */}
      <div className="brand-seo-content">
        <h2>{title ?? `${toLabel(preSelectedBrand)} Receipt Generator`}</h2>
        <p>
          Generate {toLabel(preSelectedBrand)} receipts with professional formatting and brand-specific
          layouts. Create {toLabel(preSelectedBrand)} receipt templates for expense reports,
          record keeping, or business documentation with our online receipt maker.
        </p>

        <h3>Features</h3>
        <ul>
          <li><strong>Brand Templates:</strong> {toLabel(preSelectedBrand)} receipt layouts with correct formatting</li>
          <li><strong>Multiple Currencies:</strong> Support for USD, EUR, GBP, and more</li>
          <li><strong>Multi-language:</strong> Generate receipts in English, French, German, and other languages</li>
          <li><strong>Instant Delivery:</strong> Receipts sent directly to your email</li>
          <li><strong>Mobile Friendly:</strong> Works on all devices</li>
        </ul>

        <h3>How to Generate Your {toLabel(preSelectedBrand)} Receipt</h3>
        <ol>
          <li>Upload your product image (optional)</li>
          <li>Fill in the {toLabel(preSelectedBrand)} receipt fields</li>
          <li>Select your preferred currency and language</li>
          <li>Enter your email address for delivery</li>
          <li>Click &quot;Generate Receipt&quot;</li>
        </ol>
      </div>

      <style jsx>{`
        .brand-receipt-generator {
          margin: 0 auto;
          padding: 20px;
        }
        
        .brand-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px 20px;
         
          border-radius: 16px;
          border: 1px solid #e9ecef;
        }
        
        .brand-header h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 16px;
         
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
   
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
          
        }
        
        .brand-seo-content {
          margin-top: 60px;
          padding: 40px;
  
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

      <style jsx>{`
        .brand-seo-rich {
          width: 100%;
          margin: 60px auto 0;
          padding: 0 20px;
        }

        .brand-seo-inner {
          max-width: 900px;
          margin: 0 auto;
          background: #fafafa;
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 28px;
          line-height: 1.7;
          color: #333;
        }

        .brand-seo-inner h2 {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: clamp(1.6rem, 2vw, 2rem);
          color: #111;
        }

        .brand-seo-inner p {
          margin-bottom: 16px;
          font-size: 1.05rem;
        }

        .brand-seo-inner ul {
          padding-left: 20px;
          margin: 0 0 16px 0;
        }

        .brand-seo-inner li {
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .brand-seo-inner {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}