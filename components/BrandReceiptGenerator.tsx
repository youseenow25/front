"use client";
import React, { useEffect } from 'react';
import ImageUploader from './ImageUploader';

interface BrandReceiptGeneratorProps {
  preSelectedBrand: string;
}

export default function BrandReceiptGenerator({ preSelectedBrand }: BrandReceiptGeneratorProps) {
  useEffect(() => {
    // Update page title dynamically
    document.title = `${toLabel(preSelectedBrand)} Receipt Generator - HubReceipts`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Generate authentic ${toLabel(preSelectedBrand)} receipts instantly. Create professional ${toLabel(preSelectedBrand)} invoice templates.`
      );
    }
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
          Create authentic {toLabel(preSelectedBrand)} receipts with official designs and formatting
        </p>
      </div>
      
      <ImageUploader preSelectedBrand={preSelectedBrand} />
    </div>
  );
}