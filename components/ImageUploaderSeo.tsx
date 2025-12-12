"use client";
import React, { useMemo, useRef, useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import brandsSchema from "./brands";

import { Search, ChevronDown, X, AlertCircle } from 'lucide-react';

type FormState = Record<string, string>;

const NUMERIC_HINT = /(amount|price|total|tax|quantity|percent|processing_fee)/i;
const DATE_HINT = /(order_date|delivery_date|invoice_date)/i;
const PRICE_FIELDS = /(price|total|tax|amount|cost|fee)/i;

// Supported languages
const SUPPORTED_LANGUAGES = [
  { code: "english", name: "English", flag: "🇺🇸" },
  { code: "french", name: "French", flag: "🇫🇷" },
  { code: "german", name: "German", flag: "🇩🇪" },
  { code: "dutch", name: "Dutch", flag: "🇳🇱" },
  { code: "spanish", name: "Spanish", flag: "🇪🇸" },
  { code: "italian", name: "Italian", flag: "🇮🇹" },
 
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

// INTEGER validation and formatting - SIMPLIFIED FOR INTEGERS ONLY
function validateInteger(value: string): { isValid: boolean; message?: string; formattedValue?: string } {
  if (!value.trim()) {
    return { isValid: false, message: "This field is required" };
  }

  // Only allow integers (no decimals, commas, or other characters)
  if (!/^\d+$/.test(value)) {
    return { 
      isValid: false, 
      message: "Only whole numbers allowed (no decimals, commas, or other characters)" 
    };
  }

  // Check if it's a valid integer
  const intValue = parseInt(value, 10);
  if (isNaN(intValue)) {
    return { isValid: false, message: "Please enter a valid whole number" };
  }

  // Return the integer as string
  return { 
    isValid: true, 
    formattedValue: intValue.toString()
  };
}

// Extract numeric value from formatted price (remove currency symbol)
function extractNumericValue(formattedValue: string): string {
  if (!formattedValue) return '';
  
  // Remove any currency symbols and return only numbers
  const numericValue = formattedValue.replace(/[^\d]/g, '');
  
  return numericValue;
}

const getLogoPath = (brandName: string) => {
  // Convert brand name to filename format
  const filename = brandName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '') + '.webp';
  
  return `/brand-logos/${filename}`;
};

// Brand Logo Component with next/image for optimized delivery
const BrandLogo = ({ brand, size = 24 }: { brand: string; size?: number }) => {
  const [logoError, setLogoError] = useState(false);

  if (logoError) {
    return (
      <div 
        className="brand-logo-fallback"
        style={{ 
          width: size, 
          height: size, 
          borderRadius: 4,
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.6,
          color: '#666',
          fontWeight: 'bold'
        }}
      >
        {brand.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <span style={{ display: 'inline-block', width: size, height: size, flexShrink: 0 }}>
      <img
        src={getLogoPath(brand)}
        alt={`${brand} logo`}
        width={size}
        height={size}
        loading="lazy"
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          borderRadius: 4,
          display: 'block'
        }}
        onError={() => setLogoError(true)}
      />
    </span>
  );
};

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
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

// Result Modal Component
const ResultModal = ({ 
  html, 
  email, 
  onClose, 
  onCreateNew 
}: { 
  html: string; 
  email: string; 
  onClose: () => void; 
  onCreateNew: () => void;
}) => {
  return (
    <div className="result-modal-overlay">
      <div className="result-modal">
        <div className="modal-header">
            <h3>🚨🚨 IMPORTANT !!</h3>
      
          <h2 style={{textAlign:'center'}} >1. Check spam if it doesn't arrive to your email.</h2>

              <h2 style={{textAlign:'center'}} >2. If the images don't show in the receipt, just set the email as not spam.</h2>


          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Select Component for consistent styling
const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...",
  icon: Icon,
  className = ""
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`custom-select-container ${className}`} ref={selectRef}>
      <button
        type="button"
        className="custom-select-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="selected-option-content">
          {Icon && <Icon className="select-icon" />}
          <span className="selected-label">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="custom-select-panel">
          <div className="select-list">
            {options.map((option) => (
              <div
                key={option.value}
                className={`select-option ${value === option.value ? "active" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// SIMPLIFIED Integer Input Component - Only accepts integers
const IntegerInput = ({ 
  value, 
  onChange, 
  currencySymbol,
  fieldName,
  error,
  onBlur
}: {
  value: string;
  onChange: (value: string) => void;
  currencySymbol: string;
  fieldName: string;
  error?: string;
  onBlur?: () => void;
}) => {
  // Extract just the numeric part for display (remove currency symbol)
  const getDisplayValue = (val: string) => {
    if (!val) return '';
    // Remove currency symbol if present
    const numericValue = val.replace(currencySymbol, '');
    return numericValue;
  };

  const displayValue = getDisplayValue(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Only allow integers (no decimals, commas, or other characters)
    if (/^\d*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    if (displayValue.trim()) {
      const validation = validateInteger(displayValue);
      if (validation.isValid && validation.formattedValue) {
        // Format the value with currency symbol for display only
        const formattedValue = `${currencySymbol}${validation.formattedValue}`;
        onChange(formattedValue);
      }
    }
    onBlur?.();
  };

  return (
    <div className="integer-input-container">
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter whole numbers only"
        className={`integer-input ${error ? 'error' : ''}`}
      />
      {error && <div className="integer-error-message">{error}</div>}
      <span className="integer-format-badge"> (enter whole numbers only)</span>
      <div className="integer-help-text">We'll add {currencySymbol} automatically</div>
    </div>
  );
};

interface ImageUploaderProps {
  preSelectedBrand?: string;
  isBrandPage?: boolean;
  title?: string;
}

// Main component that doesn't use useSearchParams directly
function ImageUploaderContent({ preSelectedBrand, isBrandPage = false, title }: ImageUploaderProps) {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [brand, setBrand] = useState<string>(preSelectedBrand || "");
  const [formData, setFormData] = useState<FormState>({});
  const [brandSearch, setBrandSearch] = useState(preSelectedBrand ? toLabel(preSelectedBrand) : "");
  const [brandPickerOpen, setBrandPickerOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(SUPPORTED_CURRENCIES[0]);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
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

  // Get price fields from visible fields
  const priceFields = useMemo(() => {
    return visibleFields.filter(field => PRICE_FIELDS.test(field) && field !== "currency");
  }, [visibleFields]);

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

  // Handle pre-selected brand from URL or props
  useEffect(() => {
    // If we have a pre-selected brand, use it directly
    const finalBrand = preSelectedBrand || '';
    
    if (finalBrand && allBrands.includes(finalBrand)) {
      setBrand(finalBrand);
      setBrandSearch(toLabel(finalBrand));
    }
  }, [preSelectedBrand, allBrands]);

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
    // For price fields, store the formatted value (with currency symbol) for display
    // The actual numeric value will be extracted when submitting
    if (PRICE_FIELDS.test(name)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      // Sanitize input - basic XSS protection for non-price fields
      const sanitizedValue = value.replace(/[<>]/g, '');
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }

  // Handle price field validation on blur
  function handleIntegerBlur(fieldName: string, value: string) {
    if (value.trim()) {
      const validation = validateInteger(value);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, [fieldName]: validation.message || "Invalid number format" }));
      } else if (validation.formattedValue) {
        // Format the value with currency symbol for display only
        const formattedValue = `${selectedCurrency.symbol}${validation.formattedValue}`;
        setFormData(prev => ({ ...prev, [fieldName]: formattedValue }));
      }
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

  function handleLanguageChange(value: string) {
    const selectedLang = SUPPORTED_LANGUAGES.find(
      lang => lang.code === value
    ) || SUPPORTED_LANGUAGES[0];
    setSelectedLanguage(selectedLang);
  }

  function handleCurrencyChange(value: string) {
    const selectedCurr = SUPPORTED_CURRENCIES.find(
      curr => curr.code === value
    ) || SUPPORTED_CURRENCIES[0];
    setSelectedCurrency(selectedCurr);
    // ALWAYS STORE THE SYMBOL, NEVER THE CODE
    updateField("currency", selectedCurr.symbol);
    
    // Update existing price fields with new currency symbol for display
    setFormData(prev => {
      const updated = { ...prev };
      priceFields.forEach(field => {
        if (updated[field]) {
          const numericValue = extractNumericValue(updated[field]);
          if (numericValue) {
            // Update display value with new currency symbol
            updated[field] = `${selectedCurr.symbol}${numericValue}`;
          }
        }
      });
      return updated;
    });
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
      
      // Special validation for price fields
      if (PRICE_FIELDS.test(field) && formData[field]?.trim()) {
        // Extract numeric value for validation (remove currency symbol)
        const numericValue = extractNumericValue(formData[field]);
        const validation = validateInteger(numericValue);
        if (!validation.isValid) {
          newErrors[field] = validation.message || "Invalid number format";
        }
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
        
        // FOR PRICE FIELDS: Extract only the numeric value (remove currency symbol)
        if (PRICE_FIELDS.test(f) && value) {
          // Extract only the numeric value without currency symbol
          value = extractNumericValue(value);
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
        visibleFields: visibleFields.map(f => { 
          let value = formData[f];
          // For price fields, show the extracted numeric value
          if (PRICE_FIELDS.test(f) && value) {
            value = extractNumericValue(value);
          }
          return { field: f, value };
        })
      });

      const res = await fetch("https://api.hubreceipts.com/api/receipt/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
        credentials: "include",
      });

      // Handle subscription required cases (402, 403, 405)
      if (res.status === 402 || res.status === 403 || res.status === 405) {
        const html = await res.text();
        
        // Store the generated HTML and form data for the payment page
        const paymentData = {
          generatedHtml: html,
          formData: {
            brand,
            email: emailValue,
            language: selectedLanguage.code,
            currency: formData.currency || selectedCurrency.symbol,
            otherFields: formData
          },
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('pendingReceipt', JSON.stringify(paymentData));
        
        // Redirect to payment page
        router.push("/pricing");
        return;
      }

      // Handle rate limiting
      if (res.status === 429) {
        setToast({
          message: "❌ Daily limit reached. Please try again tomorrow.",
          type: "error"
        });
        return;
      }

      // Handle successful generation (active subscriber)
      if (res.ok) {
        const html = await res.text();
        setGeneratedHtml(html);
        
        setToast({
          message: `✅ Email sent to ${emailValue}`,
          type: "success"
        });
        
        // Show the result modal
        setShowResult(true);
      } else {
        // Handle other errors
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

    } catch (err) {
      console.error("❌ Receipt generation error:", err);
      setToast({
        message: "Failed to generate receipt. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCreateNewReceipt() {
    setShowResult(false);
    setGeneratedHtml(null);
    // Reset form for new receipt
    setImage(null);
    setFile(null);
    if (!preSelectedBrand) {
      setBrand("");
      setBrandSearch("");
    }
    setFormData({});
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

      {/* Result Modal */}
      {showResult && generatedHtml && (
        <ResultModal 
          html={generatedHtml}
          email={formData.email || userEmail}
          onClose={() => setShowResult(false)}
          onCreateNew={handleCreateNewReceipt}
        />
      )}

      {/* Brand Header for SEO Pages */}
      {isBrandPage && brand && (
        <div className="brand-seo-header" style={{ 
          display: 'flex', 
          gap: '6px', 
          justifyContent:'center', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          minHeight: '100px'
        }}>
          <div style={{ width: 80, height: 80, flexShrink: 0 }}>
            <img 
              alt="Brand Logo"
              width={80}
              height={80}
              loading="lazy"
              style={{
                width: 80, 
                height: 80,
                objectFit: 'contain',
                display: 'block'
              }}
              src={getLogoPath(brand)}
            />
          </div>
          <h1 style={{ backgroundColor: 'black', color: 'white', padding: '8px', borderRadius: '8px', margin: 0, minHeight: '40px', display: 'flex', alignItems: 'center' }}>
            {title ? title.replace('{brand}', toLabel(brand)) : `Receipt Generator for ${toLabel(brand)}`}
          </h1>
        </div>
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
                <p>Upload the product image</p>
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
          <CustomSelect
            value={selectedLanguage.code}
            onChange={handleLanguageChange}
            options={SUPPORTED_LANGUAGES.map(lang => ({
              value: lang.code,
              label: `${lang.flag} ${lang.name}`
            }))}
            placeholder="Select language"
          />
        </div>

        {/* Brand Selector - Custom Dropdown with Logos */}
        <div className="brand-picker" ref={brandPickerRef}>
          <label htmlFor="brand" className="field-label">
            Brand *
          </label>
          <div className="picker-container">
            <button
              type="button"
              className={`picker-btn ${errors.brand ? 'error' : ''} ${preSelectedBrand ? 'pre-selected' : ''}`}
              onClick={toggleBrandPicker}
            >
              <div className="selected-option-content">
                <Search className="select-icon" />
                <span className="selected-label">
                  {brand ? (
                    <span className="brand-option">
                      <BrandLogo brand={brand} size={20} />
                      {toLabel(brand)}
                    </span>
                  ) : "Select a Brand"}
                </span>
              </div>
              <ChevronDown className={`dropdown-arrow ${brandPickerOpen ? 'open' : ''}`} />
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
                        className={`picker-item ${brand === b ? "active" : ""} ${preSelectedBrand === b ? "pre-selected-item" : ""}`}
                        onClick={() => {
                          setBrand(b);
                          setBrandPickerOpen(false);
                          setBrandSearch(toLabel(b));
                          if (errors.brand) {
                            setErrors(prev => ({ ...prev, brand: "" }));
                          }
                        }}
                      >
                        <BrandLogo brand={b} size={24} />
                        {toLabel(b)}
                        {preSelectedBrand === b && (
                          <span className="item-pre-selected-badge">Current</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="picker-empty">No brands found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Currency Selector */}
        <div className="field">
          <label htmlFor="currency" className="field-label">
            Currency
          </label>
          <CustomSelect
            value={selectedCurrency.code}
            onChange={handleCurrencyChange}
            options={SUPPORTED_CURRENCIES.map(currency => ({
              value: currency.code,
              label: `${currency.symbol} ${currency.name} (${currency.code})`
            }))}
            placeholder="Select currency"
          />
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
          <div className="form-grid" style={{ minHeight: visibleFields.length > 2 ? '300px' : '200px' }}>
            {visibleFields
              .filter(field => field !== "email" && field !== "currency")
              .map((field) => {
                const type = inputTypeFor(field);
                const isDateField = DATE_HINT.test(field);
                const isPriceField = PRICE_FIELDS.test(field);
                
                return (
                  <div key={field} className="field">
                    <label htmlFor={field}>
                      {toLabel(field)} *
                      {isDateField && !formData[field] && (
                        <span className="auto-detected-badge"> (auto-filled)</span>
                      )}
                      {isPriceField && (
                        <span className="integer-format-badge"> </span>
                      )}
                    </label>
                    
                    {isPriceField ? (
                      <IntegerInput
                        value={formData[field] || ""}
                        onChange={(value) => updateField(field, value)}
                        currencySymbol={selectedCurrency.symbol}
                        fieldName={field}
                        error={errors[field]}
                        onBlur={() => handleIntegerBlur(field, formData[field] || "")}
                      />
                    ) : (
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
                    )}
                    
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
          <div style={{ minHeight: '60px', display: 'flex', alignItems: 'center' }}>
            <p className="brand-hint">Choose a brand to see its required fields.</p>
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={!isFormValid || loading}
        >
          {loading ? "Generating..." : `Generate ${brand ? toLabel(brand) + ' ' : ''}Receipt`}
        </button>

        {/* SEO Keywords Section */}
        {isBrandPage && brand && (
          <div className="seo-keywords-section">
            <div className="seo-tags">
              <span className="seo-tag">{toLabel(brand)} receipt</span>
              <span className="seo-tag">{toLabel(brand)} invoice</span>
              <span className="seo-tag">{toLabel(brand)} receipt generator</span>
              <span className="seo-tag">{toLabel(brand)} invoice template</span>
              <span className="seo-tag">free {toLabel(brand)} receipt maker</span>
            </div>
          </div>
        )}
      </form>

      <style>{`
        .wrap {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 24px;
          align-items: start;
          width: 100%;
          max-width: none;
          margin: 20px 0 40px;
          position: relative;
          min-height: 400px;
          padding: 0 20px;
          box-sizing: border-box;
        }
        
        @media (max-width: 900px) {
          .wrap { 
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 0 16px;
          }
        }

        /* Brand SEO Header */
        .brand-seo-header {
          grid-column: 1 / -1;
          text-align: center;
        }

        .brand-seo-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 12px;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-seo-description {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .image-uploader {
          border: 2px dashed #ccc;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: background 0.2s ease;
          height: 320px;
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }
        
        .image-uploader:hover { background: #f0f0f0; }
        
        .image-preview {
          max-width: 100%;
          max-height: 100%;
          border-radius: 12px;
          object-fit: contain;
          width: auto;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        
        .upload-placeholder {
          color: #666;
          width: 100%;
        }
        
        .upload-icon {
          margin-bottom: 12px;
        }
        
        .upload-text p {
          margin: 0 0 4px 0;
          font-weight: 500;
        }
        
        .upload-text span {
          font-size: 14px;
          color: #888;
        }
        
        .data-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          width: 100%;
        }
        
        /* Pre-selected brand styles */
        .pre-selected-indicator {
          font-size: 11px;
          color: #2e7d32;
          margin-left: 8px;
          font-weight: normal;
          background: #e8f5e8;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .matched-badge {
          font-size: 11px;
          color: #2e7d32;
          margin-left: 8px;
          background: #e8f5e8;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .pre-selected-item {

        }

        .item-pre-selected-badge {
          font-size: 10px;
          color: #2e7d32;
          background: #e8f5e8;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: auto;
        }

        .pre-selected-note {
          font-size: 12px;
          color: #666;
          margin-top: 6px;
          padding: 8px 12px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        /* SEO Keywords Section */
        .seo-keywords-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }

        .seo-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .seo-tag {
          font-size: 12px;
          color: #666;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }
        
        /* Custom Select Styles */
        .custom-select-container {
          position: relative;
          width: 100%;
        }
        
        .custom-select-button {
          width: 100%;
          padding: 12px 16px;
          background: #efefef;
          border: none;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
        }
        
        .custom-select-button:hover {
          background: #e5e5e5;
        }
        
        .selected-option-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }
        
        .select-icon {
          width: 20px;
          height: 20px;
          color: #666;
          flex-shrink: 0;
        }
        
        .selected-label {
          text-align: left;
          flex: 1;
        }
        
        .brand-option {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .dropdown-arrow {
          width: 16px;
          height: 16px;
          color: #666;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        
        .dropdown-arrow.open {
          transform: rotate(180deg);
        }
        
        .custom-select-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 8px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          z-index: 9999;
          overflow: hidden;
          margin-top: 4px;
        }
        
        .select-list {
          max-height: 200px;
          overflow-y: auto;
        }
        
        .select-option {
          padding: 12px 14px;
          cursor: pointer;
          border-radius: 6px;
          background: transparent;
          transition: background 0.2s ease;
          font-size: 14px;
        }
        
        .select-option:hover {
          background: #f8f8f8;
        }
        
        .select-option.active {
          background: #000;
          color: #fff;
        }
        
        /* Picker Styles */
        .picker-container {
          position: relative;
          width: 100%;
        }
        
        .field-label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 6px;
          display: block;
        }
        
        .picker-btn {
          width: 100%;
          padding: 12px 16px;
          background: #efefef;
          border: none;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
        }
        
        .picker-btn:hover {
          background: #e5e5e5;
        }
        
        .picker-btn.error {
          border: 1px solid #d32f2f;
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
          width: 100%;
          box-sizing: border-box;
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
          width: 100%;
        }
        
        .picker-item {
          padding: 12px 14px;
          cursor: pointer;
          border-radius: 6px;
          background: transparent;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          min-height: 44px;
          box-sizing: border-box;
          width: 100%;
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
          width: 100%;
        }
        
        .brand-hint { color: #777; margin: 6px 0 12px; }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          width: 100%;
        }
        
        .field { 
          display: flex; 
          flex-direction: column; 
          gap: 6px; 
          width: 100%;
        }
        
        .field label { 
          font-size: 13px; 
          color: #444; 
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
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
        
        /* SIMPLIFIED Integer Input Styles */
        .integer-input-container {
          width: 100%;
        }
        
        .integer-input {
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          width: 100%;
          background: transparent;
          box-sizing: border-box;
        }
        
        .integer-input:focus {
          outline: none;
          border-color: #000;
        }
        
        .integer-input.error {
          border-color: #d32f2f;
        }
        
        .integer-error-message {
          font-size: 12px;
          color: #d32f2f;
          margin-top: 4px;
        }
        
        .integer-help-text {
          font-size: 11px;
          color: #666;
          margin-top: 4px;
          font-style: italic;
        }
        
        .integer-format-badge {
          font-size: 11px;
          color: #2e7d32;
          font-weight: normal;
          margin-left: 4px;
          font-style: italic;
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
        
        /* Toast Styles */
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
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
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
        .toast-message {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
        }
        .toast-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: inherit;
          opacity: 0.7;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .toast-close:hover {
          opacity: 1;
        }
        
        /* Result Modal Styles */
        .result-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }
        
        .result-modal {
          background: black;
          max-width: 90%;
          max-height: 90vh;
          width: 800px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #eee;
        }
        
        .modal-header h3 {
          margin: 0;
          color: #333;
          font-size: 20px;
        }
        
        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }
        
        .close-button:hover {
          background: #f5f5f5;
          color: #333;
        }
        
        .modal-content {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }
        
        .success-message {
          text-align: center;
          margin-bottom: 20px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .success-message p {
          margin: 0 0 8px 0;
          font-size: 16px;
        }
        
        .preview-text {
          font-weight: 600;
          margin-top: 8px;
          color: #333;
          font-size: 14px;
        }
        
        .html-preview {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          background: white;
          max-height: 400px;
          overflow-y: auto;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        .primary-btn {
          background: #000;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
        }
        
        .primary-btn:hover {
          background: #333;
        }
        
        .secondary-btn {
          background: #f0f0f0;
          color: #333;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
        }
        
        .secondary-btn:hover {
          background: #e0e0e0;
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
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .wrap {
            padding: 0 16px;
            gap: 20px;
          }
          
          .brand-seo-header h1 {
            font-size: 2rem;
          }
          
          .brand-seo-description {
            font-size: 1rem;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .image-uploader {
            min-height: 280px;
            padding: 20px;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .result-modal {
            width: 95%;
            max-height: 85vh;
          }

          .seo-tags {
            justify-content: flex-start;
          }
        }
        
        @media (max-width: 480px) {
          .wrap {
            padding: 0 12px;
          }
          
          .image-uploader {
            min-height: 240px;
            padding: 16px;
          }
          
          .modal-header {
            padding: 16px 20px;
          }
          
          .modal-header h3 {
            font-size: 18px;
          }
          
          .modal-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

// Main export with Suspense boundary
export default function ImageUploader({ preSelectedBrand, isBrandPage = false, title }: ImageUploaderProps) {
  return (
    <Suspense fallback={
      <div className="wrap">
        <div className="image-uploader">
          <div className="upload-placeholder">
            <div className="upload-icon">
              <span style={{fontSize:30}}>📎</span>
            </div>
            <div className="upload-text">
              <p>Loading form...</p>
            </div>
          </div>
        </div>
        <form className="data-form">
          <div className="field">
            <label className="field-label">Loading...</label>
            <div style={{padding: '12px 16px', background: '#efefef', borderRadius: '8px'}}>
              Loading form data...
            </div>
          </div>
        </form>
      </div>
    }>
      <ImageUploaderContent preSelectedBrand={preSelectedBrand} isBrandPage={isBrandPage} title={title} />
    </Suspense>
  );
}



