"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import brandsSchema from "./brands";

type FormState = Record<string, string>;

const NUMERIC_HINT = /(amount|price|total|tax|quantity|percent|processing_fee)/i;
const DATE_HINT = /(order_date|delivery_date|invoice_date)/i;

// Supported languages
const SUPPORTED_LANGUAGES = [
  { code: "english", name: "English", flag: "🇺🇸" },
  { code: "french", name: "French", flag: "🇫🇷" },
  { code: "german", name: "German", flag: "🇩🇪" },
  { code: "dutch", name: "Dutch", flag: "🇳🇱" },
  { code: "spanish", name: "Spanish", flag: "🇪🇸" },
  { code: "italian", name: "Italian", flag: "🇮🇹" }
];

// Currency configuration - SYMBOLS ONLY
const SUPPORTED_CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" }
];

// Currency code to symbol mapping for conversion
const CURRENCY_CODE_TO_SYMBOL: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'CAD': 'C$',
  'AUD': 'A$',
  'CHF': 'CHF',
  'CNY': '¥',
  'INR': '₹',
  'TRY': '₺'
};

// Map browser language codes to our supported languages
const LANGUAGE_MAP: Record<string, string> = {
  'en': 'english',
  'en-US': 'english',
  'en-GB': 'english',
  'fr': 'french',
  'fr-FR': 'french',
  'fr-CA': 'french',
  'de': 'german',
  'de-DE': 'german',
  'de-AT': 'german',
  'nl': 'dutch',
  'nl-NL': 'dutch',
  'nl-BE': 'dutch',
  'es': 'spanish',
  'es-ES': 'spanish',
  'es-MX': 'spanish',
  'it': 'italian',
  'it-IT': 'italian'
};

function toLabel(name: string) {
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

function inputTypeFor(field: string): "text" | "number" | "email" | "date" | "url" | "select" {
  if (field === "email") return "email";
  if (field === "currency") return "select";
  if (DATE_HINT.test(field)) return "date";
  if (field.includes("image")) return "url";
  if (NUMERIC_HINT.test(field)) return "number";
  return "text";
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Robust currency symbol converter
function ensureCurrencySymbol(value: string): string {
  if (!value) return '';
  
  // If it's already a symbol, return it
  const isSymbol = SUPPORTED_CURRENCIES.some(curr => curr.symbol === value);
  if (isSymbol) return value;
  
  // If it's a code, convert to symbol
  const symbol = CURRENCY_CODE_TO_SYMBOL[value];
  if (symbol) return symbol;
  
  // If it's unknown, return the original value
  return value;
}

// Toast Component
const Toast = ({ message, type = "success", onClose }: { 
  message: string; 
  type?: "success" | "error"; 
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          
        </span>
        <span className="toast-message">{message}</span>
      </div>

      <style>{`
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 10000;
          animation: slideIn 0.3s ease-out;
          max-width: 400px;
        }
        .toast-success {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }
        .toast-error {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }
        .toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .toast-icon {
          font-size: 16px;
        }
        .toast-message {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
        }
        .toast-close {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          margin-left: 12px;
          color: inherit;
          opacity: 0.7;
        }
        .toast-close:hover {
          opacity: 1;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default function ImageUploader() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [brand, setBrand] = useState<string>("");
  const [formData, setFormData] = useState<FormState>({});
  const [brandSearch, setBrandSearch] = useState("");
  const [brandPickerOpen, setBrandPickerOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(SUPPORTED_CURRENCIES[0]);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const brandPickerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const allBrands = useMemo(() => Object.keys(brandsSchema.brands || {}).sort(), []);
  const visibleFields = useMemo<string[]>(
    () => (brand ? brandsSchema.brands[brand]?.placeholders ?? [] : []),
    [brand]
  );

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return allBrands;
    return allBrands.filter((b) =>
      toLabel(b).toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [allBrands, brandSearch]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    if (!brand || !file) return false;
    
    // Check all visible fields (except email which we handle separately)
    for (const field of visibleFields) {
      if (field !== "email" && !formData[field]?.trim()) {
        return false;
      }
    }
    
    // Check email separately
    if (!formData.email?.trim() && !userEmail) {
      return false;
    }
    
    return true;
  }, [brand, file, visibleFields, formData, userEmail]);

  // Detect browser language on component mount and set default date values
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.email) {
          setUserEmail(user.email);
          setFormData(prev => ({ ...prev, email: user.email }));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Detect browser language
    const browserLanguage = navigator.language || (navigator as any).userLanguage;
    const detectedLangCode = LANGUAGE_MAP[browserLanguage] || 'english';
    
    // Find the matching language object
    const detectedLanguage = SUPPORTED_LANGUAGES.find(
      lang => lang.code === detectedLangCode
    ) || SUPPORTED_LANGUAGES[0];
    
    setSelectedLanguage(detectedLanguage);

    // Set default order date to today if not already set
    const today = formatDate(new Date());
    setFormData(prev => {
      const updated = { ...prev };
      
      // Set default order_date if it's a visible field and not already set
      if (brand && visibleFields.includes("order_date") && !prev.order_date) {
        updated.order_date = today;
      }
      
      // Set default delivery_date if it's a visible field and not already set
      if (brand && visibleFields.includes("delivery_date") && !prev.delivery_date) {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        updated.delivery_date = formatDate(deliveryDate);
      }
      
      // Set default invoice_date if it's a visible field and not already set
      if (brand && visibleFields.includes("invoice_date") && !prev.invoice_date) {
        updated.invoice_date = today;
      }
      
      // Set default currency if it's a visible field - ALWAYS USE SYMBOL
      if (brand && visibleFields.includes("currency") && !prev.currency) {
        updated.currency = selectedCurrency.symbol;
      }
      
      return updated;
    });
  }, [brand, visibleFields, selectedCurrency]);

  // Update default dates when brand changes
  useEffect(() => {
    if (brand) {
      const today = formatDate(new Date());
      setFormData(prev => {
        const updated = { ...prev };
        
        // Set default order_date if it's a visible field and not already set
        if (visibleFields.includes("order_date") && !prev.order_date) {
          updated.order_date = today;
        }
        
        // Set default delivery_date if it's a visible field and not already set
        if (visibleFields.includes("delivery_date") && !prev.delivery_date) {
          const deliveryDate = new Date();
          deliveryDate.setDate(deliveryDate.getDate() + 3);
          updated.delivery_date = formatDate(deliveryDate);
        }
        
        // Set default invoice_date if it's a visible field and not already set
        if (visibleFields.includes("invoice_date") && !prev.invoice_date) {
          updated.invoice_date = today;
        }
        
        // Set default currency if it's a visible field - ALWAYS USE SYMBOL
        if (visibleFields.includes("currency") && !prev.currency) {
          updated.currency = selectedCurrency.symbol;
        }
        
        return updated;
      });
    }
  }, [brand, visibleFields, selectedCurrency]);

  // Close brand dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (brandPickerRef.current && !brandPickerRef.current.contains(event.target as Node)) {
        setBrandPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function updateField(name: string, value: string) {
    // Sanitize input - basic XSS protection
    const sanitizedValue = value.replace(/[<>]/g, '');
    
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }

  // Fixed: Separate handler for brand search
  function handleBrandSearchChange(value: string) {
    setBrandSearch(value);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    
    // Validate file type and size
    if (!selected.type.startsWith("image/")) {
      setErrors(prev => ({ ...prev, image: "Please upload an image file" }));
      return;
    }
    
    if (selected.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "File size must be less than 5MB" }));
      return;
    }
    
    setFile(selected);
    setErrors(prev => ({ ...prev, image: "" }));
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(selected);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const selected = event.dataTransfer.files?.[0];
    if (!selected || !selected.type.startsWith("image/")) return;
    
    // Validate file size
    if (selected.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "File size must be less than 5MB" }));
      return;
    }
    
    setFile(selected);
    setErrors(prev => ({ ...prev, image: "" }));
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(selected);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function toggleBrandPicker() {
    setBrandPickerOpen(!brandPickerOpen);
  }

  function handleLanguageChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedLang = SUPPORTED_LANGUAGES.find(
      lang => lang.code === event.target.value
    ) || SUPPORTED_LANGUAGES[0];
    setSelectedLanguage(selectedLang);
  }

  function handleCurrencyChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedCurr = SUPPORTED_CURRENCIES.find(
      curr => curr.code === event.target.value
    ) || SUPPORTED_CURRENCIES[0];
    setSelectedCurrency(selectedCurr);
    // ALWAYS STORE THE SYMBOL, NEVER THE CODE
    updateField("currency", selectedCurr.symbol);
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!brand) {
      newErrors.brand = "Please select a brand";
    }

    if (!file) {
      newErrors.image = "Please upload a product image";
    }

    // Check all visible fields
    visibleFields.forEach(field => {
      if (field !== "email" && !formData[field]?.trim()) {
        newErrors[field] = `${toLabel(field)} is required`;
      }
    });

    // Check email with basic validation
    const emailValue = formData.email || userEmail;
    if (!emailValue) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("auth_token");

    if (!token) {
      router.push("/register");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("brand", brand);
      form.append("language", selectedLanguage.code);
      
      // Add all visible fields to form data with default values for date fields
      visibleFields.forEach((f) => {
        let value = formData[f];
        
        // If it's a date field and no value is provided, set default value
        if (DATE_HINT.test(f) && !value) {
          if (f === "order_date" || f === "invoice_date") {
            value = formatDate(new Date());
          } else if (f === "delivery_date") {
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 3);
            value = formatDate(deliveryDate);
          }
        }
        
        // FOR CURRENCY FIELD: ENSURE WE ALWAYS SEND SYMBOL
        if (f === "currency") {
          // If no value is set, use the selected currency symbol
          if (!value) {
            value = selectedCurrency.symbol;
          } else {
            // CONVERT ANY CODE TO SYMBOL - ROBUST PROTECTION
            value = ensureCurrencySymbol(value);
          }
        }
        
        if (value) {
          form.append(f, value);
        }
      });
      
      // Always include the email field with validation
      const emailValue = formData.email || userEmail;
      if (emailValue) {
        form.append("email", emailValue);
      }
      
      if (file) {
        form.append("product_image", file);
      }

      console.log("Submitting form data:", {
        brand,
        language: selectedLanguage.code,
        currency: formData.currency ? ensureCurrencySymbol(formData.currency) : selectedCurrency.symbol,
        email: emailValue,
        visibleFields: visibleFields.map(f => ({ 
          field: f, 
          value: f === 'currency' ? ensureCurrencySymbol(formData[f] || '') : formData[f] 
        }))
      });

      const res = await fetch("https://api.hubreceipts.com/api/receipt/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
        credentials: "include",
      });

      if (res.status === 402 || res.status === 403) {
        window.open("https://discord.gg/hubreceipts", "_blank");
        return;
      }

      const html = await res.text();
      setGeneratedHtml(html);
      
      // Show success toast
      setToast({
        message: `✅ Email sent to ${emailValue}`,
        type: "success"
      });

    } catch (err) {
      console.error("❌ Receipt generation error:", err);
      
      router.push("/payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="wrap" ref={wrapRef}>
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)} 
        />
      )}

      {/* LEFT: Image picker */}
      <div
        className="image-uploader"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        aria-label="Upload image"
        tabIndex={0}
      >
        {image ? (
          <img src={image} alt="Preview" className="image-preview" />
        ) : (
          <div className="upload-placeholder">
             <div className="upload-icon">
             <span style={{fontSize:30}} >
              📎
              </span> 
              </div>
                          <div className="upload-text">
                            <p>Upload the product image </p>
                            <span>PNG, JPG up to 5MB</span>
                          </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {errors.image && <div className="error-message">{errors.image}</div>}
      </div>

      {/* RIGHT: Dynamic form */}
      <form className="data-form" onSubmit={handleSubmit}>
        {/* Language Selector */}
        <div className="field">
          <label htmlFor="language" className="field-label">
            Language
          </label>
          <select
            style={{height:40}}
            id="language"
            name="language"
            value={selectedLanguage.code}
            onChange={handleLanguageChange}
            className="native-select"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Selector - Custom Dropdown */}
        <div className="brand-picker" ref={brandPickerRef}>
          <label htmlFor="brand" className="field-label">Brand *</label>
          <div className="picker-container">
            <button
              type="button"
              className={`picker-btn ${errors.brand ? 'error' : ''}`}
              onClick={toggleBrandPicker}
            >
              <span className="selected-option">
                {brand ? toLabel(brand) : "Select a Brand"}
              </span>
              <span className="dropdown-arrow">▼</span>
            </button>
            {brandPickerOpen && (
              <div className="picker-panel">
                <input
                  type="text"
                  placeholder="Search brand..."
                  value={brandSearch}
                  onChange={(e) => handleBrandSearchChange(e.target.value)}
                  className="picker-search"
                  autoFocus
                />
                <div className="picker-list">
                  {filteredBrands.length > 0 ? (
                    filteredBrands.map((b) => (
                      <div
                        key={b}
                        className={`picker-item ${brand === b ? "active" : ""}`}
                        onClick={() => {
                          setBrand(b);
                          setBrandPickerOpen(false);
                          setBrandSearch("");
                          if (errors.brand) {
                            setErrors(prev => ({ ...prev, brand: "" }));
                          }
                        }}
                      >
                        {toLabel(b)}
                      </div>
                    ))
                  ) : (
                    <div className="picker-empty">No brands found</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {errors.brand && <div className="error-message">{errors.brand}</div>}
        </div>

        {/* Currency Selector - Shows symbol and ALWAYS sends symbol */}
        <div className="field">
          <label htmlFor="currency" className="field-label">
            Currency
          </label>
          <select
            style={{height:40}}
            id="currency"
            name="currency"
            value={selectedCurrency.code}
            onChange={handleCurrencyChange}
            className="native-select"
          >
            {SUPPORTED_CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.name} ({currency.code})
              </option>
            ))}
          </select>
          <div className="currency-display-note">
            Selected: <strong>{selectedCurrency.symbol}</strong> - {selectedCurrency.name}
          </div>
        </div>

        {/* Email Field - Always Visible */}
        <div className="field">
          <label htmlFor="email">
            Email Address *
            {userEmail && (
              <span className="default-badge"> (the receipt will be sent to this email)</span>
            )}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email || userEmail}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="Enter email address"
            className={`${userEmail && !formData.email ? "email-field" : ''} ${errors.email ? 'error' : ''}`}
          />
          {userEmail && !formData.email && (
            <div className="email-note">
              Using your account email. You can change it above.
            </div>
          )}
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        {brand ? (
          <div className="form-grid">
            {visibleFields
              .filter(field => field !== "email" && field !== "currency") // Remove email and currency from visible fields since they're always shown
              .map((field) => {
                const type = inputTypeFor(field);
                const isDateField = DATE_HINT.test(field);
                
                return (
                  <div key={field} className="field">
                    <label htmlFor={field}>
                      {toLabel(field)} *
                      {isDateField && !formData[field] && (
                        <span className="auto-detected-badge"> (auto-filled)</span>
                      )}
                    </label>
                    <input
                      id={field}
                      name={field}
                      type={type}
                      value={formData[field] || ""}
                      onChange={(e) => updateField(field, e.target.value)}
                      placeholder={toLabel(field)}
                      className={errors[field] ? 'error' : ''}
                      {...(type === "number" ? { step: "any" } : {})}
                    />
                    {isDateField && !formData[field] && (
                      <div className="email-note">
                        Today's date will be used if not specified
                      </div>
                    )}
                    {errors[field] && <div className="error-message">{errors[field]}</div>}
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="brand-hint">Choose a brand to see its required fields.</p>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={!isFormValid || loading}
        >
          {loading ? "Generating..." : "Send receipt to my email"}
        </button>

      </form>

      {/*  {generatedHtml && (
        <div className="receipt-preview">
          <h2>Generated Receipt ({selectedLanguage.name})</h2>
          <iframe
            srcDoc={generatedHtml}
            title="Generated Receipt"
            style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}
            sandbox="allow-same-origin" // Security measure
          />
        </div>
      )} */}
     

      {/* UPDATED CSS */}
      <style>{`
        .wrap {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 24px;
          align-items: start;
          width: 95%;
          max-width: 1200px;
          margin: 20px auto 40px;
          position: relative;
          min-height: 400px;
        }
        @media (max-width: 900px) {
          .wrap { 
            grid-template-columns: 1fr;
            min-height: auto;
          }
        }
        .image-uploader {
          border: 2px dashed #ccc;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: background 0.2s ease;
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .image-uploader:hover { background: #f0f0f0; }
        .image-preview {
          max-width: 100%;
          max-height: 500px;
          border-radius: 12px;
          object-fit: contain;
        }
        .upload-placeholder {
          color: #666;
        }
        .upload-required {
          font-size: 12px;
          color: #d32f2f;
          margin-top: 8px;
          font-weight: 500;
        }
        .data-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
        }
        
        /* Native Select Styles */
        .native-select {
       
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          width: 100%;
          background: transparent;
          color: #333;
          cursor: pointer;
          appearance: menulist;
        }
        
        .native-select:focus {
          outline: none;
          border-color: #000;
        }
        
        /* Picker Styles */
        .picker-container {
          position: relative;
        }
        .field-label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 6px;
          display: block;
        }
        .picker-btn {
          padding: 12px;
          background: transparent;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: border-color 0.2s ease;
        }
        .picker-btn:hover {
          border-color: #999;
          background: #f5f5f5;
        }
        .picker-btn.error {
          border-color: #d32f2f;
        }
        .selected-option {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dropdown-arrow {
          font-size: 12px;
          color: #666;
          transition: transform 0.2s ease;
        }
        .picker-btn:hover .dropdown-arrow {
          transform: translateY(1px);
        }
        
        .picker-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          z-index: 9999;
          overflow: hidden;
          margin-top: 4px;
        }
        
        .picker-search {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          margin-bottom: 10px;
          background: transparent;
          color: #333;
          box-sizing: border-box;
        }
        .picker-search::placeholder { color: #999; }
        .picker-search:focus {
          outline: none;
          border-color: #000;
        }
        .picker-list {
          max-height: 300px;
          overflow-y: auto;
        }
        .picker-item {
          padding: 12px 14px;
          cursor: pointer;
          border-radius: 6px;
          background: transparent;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          min-height: 44px;
          box-sizing: border-box;
        }
        .picker-item:hover { background: #f8f8f8; }
        .picker-item.active {
          background: #000;
          color: #fff;
        }
        .picker-empty {
          text-align: center;
          color: #888;
          font-size: 14px;
          padding: 20px 0;
        }
        .brand-hint { color: #777; margin: 6px 0 12px; }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
        }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 13px; color: #444; }
        .field input {
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          width: 100%;
          background: transparent;
          box-sizing: border-box;
        }
        .field input:focus {
          outline: none;
          border-color: #000;
        }
        .field input.error {
          border-color: #d32f2f;
        }
        .email-field {
          background-color: #f8f8f8;
          border-color: #ddd;
        }
        .default-badge {
          font-size: 11px;
          color: #666;
          font-weight: normal;
          margin-left: 4px;
        }
        .auto-detected-badge {
          font-size: 11px;
          color: #0066cc;
          font-weight: normal;
          margin-left: 4px;
          font-style: italic;
        }
        .email-note {
          font-size: 12px;
          color: #666;
          font-style: italic;
          margin-top: 4px;
        }
        .currency-display-note {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
          font-style: italic;
        }
        .currency-display-note strong {
          color: #000;
          font-weight: 600;
        }
        .error-message {
          font-size: 12px;
          color: #d32f2f;
          margin-top: 4px;
        }
        .submit-btn {
          margin-top: 6px;
          padding: 12px 24px;
          background: black;
          color: white;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
          width: fit-content;
          font-size: 16px;
        }
        .submit-btn:disabled {
          background: #bbb;
          cursor: not-allowed;
        }
        .submit-btn:hover:not(:disabled) { background: #333; }
        .receipt-preview {
          margin-top: 32px;
          grid-column: 1 / -1;
        }
        .validation-hint {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 12px;
          color: #856404;
          font-size: 14px;
          margin-top: 10px;
        }

        /* Ensure dropdowns are properly positioned */
        .brand-picker {
          position: relative;
        }
      `}</style>
    </div>
  );
}