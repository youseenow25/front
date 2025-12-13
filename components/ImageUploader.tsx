"use client";
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
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
  { code: "swedish", name: "Swedish", flag: "🇮🇸" },
  { code: "danish", name: "Danish", flag: "🇩🇰" },
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

// Validate image file with comprehensive checks
function validateImageFile(file: File | null): { isValid: boolean; message?: string } {
  if (!file) {
    return { isValid: false, message: "Please select an image file" };
  }

  // Check if it's an image file
  if (!file.type.startsWith("image/")) {
    return { isValid: false, message: "File must be an image (PNG, JPG, JPEG, GIF, WEBP)" };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, message: "Image size must be less than 5MB" };
  }

  // Check for specific supported image types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const fileType = file.type.toLowerCase();
  
  if (!allowedTypes.includes(fileType)) {
    return { isValid: false, message: "Unsupported image format. Use PNG, JPG, JPEG, GIF, or WEBP" };
  }

  return { isValid: true };
}

// Brand Logo Component with better error handling (uses next/image for optimizations)
const BrandLogo = ({ brand, size = 24 }: { brand: string; size?: number }) => {
  const [logoError, setLogoError] = useState(false);
  
  const getLogoPath = useCallback((brandName: string) => {
    if (!brandName) return '';
    // Convert brand name to filename format
    const filename = brandName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') + '.webp';
    
    return `/brand-logos/${filename}`;
  }, []);

  try {
    if (logoError || !brand) {
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
          {brand ? brand.charAt(0).toUpperCase() : '?'}
        </div>
      );
    }

    return (
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
          borderRadius: 4
        }}
        onError={() => setLogoError(true)}
      />
    );
  } catch (error) {
    console.error('Error rendering brand logo:', error);
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
        ?
      </div>
    );
  }
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
      <div className="result-modal" style={{ background: '#efefef', padding: '2px', borderRadius: '5px' }}>
        <div
          className="modal-header"
          style={{
            flexDirection: 'column',
            gap: '10px',
            color: '#000',
            position: 'relative'
          }}
        >
          <h3>🚨🚨 IMPORTANT !!</h3>
          <h2 style={{textAlign:'center'}} >1. Check spam if it doesn't arrive to your email.</h2>
          <h2 style={{textAlign:'center'}} >2. If the images don't show in the receipt, just set the email as not spam.</h2>
          <button className="close-button" onClick={onClose} style={{ position: 'absolute', top: 0, right: 0 }}>
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
  const getDisplayValue = useCallback((val: string) => {
    if (!val) return '';
    // Remove currency symbol if present
    const numericValue = val.replace(currencySymbol, '');
    return numericValue;
  }, [currencySymbol]);

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

// Safe Image Preview Component with error boundary - reserves layout to reduce CLS
const SafeImagePreview = ({ imageSrc, alt = "Preview" }: { imageSrc: string | null; alt?: string }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [imageSrc]);

  if (!imageSrc) return null;

  if (hasError) {
    return (
      <div className="image-error-fallback" aria-live="polite">
        <div className="error-icon">
          <AlertCircle size={48} />
        </div>
        <p>Failed to load image preview</p>
        <p className="error-subtext">The image file is still valid for upload</p>
      </div>
    );
  }

  return (
    <div className="image-preview-container" aria-live="polite" aria-busy={isLoading}>
      {isLoading && (
        <div className="image-loading-overlay" aria-hidden="true">
          <div className="loading-spinner"></div>
          <span>Loading preview...</span>
        </div>
      )}
      {/* Provide intrinsic width/height to reserve layout space and avoid CLS */}
      <img 
        src={imageSrc} 
        alt={alt} 
        width={800}
        height={600}
        className="image-preview"
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
        }}
        onError={(e) => {
          console.error('Image preview error:', e);
          setHasError(true);
          setIsLoading(false);
        }}
        loading="lazy"
        style={{ 
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in'
        }}
      />
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
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const brandPickerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fileReaderRef = useRef<FileReader | null>(null);

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

  // Cleanup FileReader on unmount
  useEffect(() => {
    return () => {
      if (fileReaderRef.current) {
        fileReaderRef.current.abort();
        fileReaderRef.current = null;
      }
    };
  }, []);

  // Detect browser language on component mount and set default date values
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let isMounted = true;

    try {
      const userData = localStorage.getItem("user");
      if (userData && isMounted) {
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
      if (typeof navigator !== 'undefined' && isMounted) {
        try {
          const browserLanguage = navigator.language || (navigator as any).userLanguage;
          const detectedLangCode = LANGUAGE_MAP[browserLanguage] || 'english';
          
          // Find the matching language object
          const detectedLanguage = SUPPORTED_LANGUAGES.find(
            lang => lang.code === detectedLangCode
          ) || SUPPORTED_LANGUAGES[0];
          
          if (isMounted) {
            setSelectedLanguage(detectedLanguage);
          }
        } catch (error) {
          console.error("Error detecting language:", error);
        }
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }

    return () => {
      isMounted = false;
    };

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

  const updateField = useCallback((name: string, value: string) => {
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
  }, [errors]);

  // Handle price field validation on blur
  const handleIntegerBlur = useCallback((fieldName: string, value: string) => {
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
  }, [selectedCurrency.symbol]);

  // Handle brand search change
  const handleBrandSearchChange = useCallback((value: string) => {
    setBrandSearch(value);
  }, []);

  // Safe image processing with abort capability - FIXED for Chrome preview issue
  const processImageFile = useCallback((selectedFile: File) => {
    // Abort any ongoing FileReader
    if (fileReaderRef.current) {
      fileReaderRef.current.abort();
      fileReaderRef.current = null;
    }

    // Validate the file first
    const validation = validateImageFile(selectedFile);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, image: validation.message || "Invalid image file" }));
      setFile(null);
      setImage(null);
      return;
    }

    setFile(selectedFile);
    setErrors(prev => ({ ...prev, image: "" }));
    setIsProcessingImage(true);

    try {
      // Create new FileReader
      const reader = new FileReader();
      fileReaderRef.current = reader;

      reader.onloadstart = () => {
        // Can show loading indicator if needed
      };

      reader.onload = (e) => {
        try {
          if (e.target?.result && typeof e.target.result === 'string') {
            setImage(e.target.result);
          }
        } catch (error) {
          console.error('Error setting image data:', error);
          setErrors(prev => ({ 
            ...prev, 
            image: "Failed to process image preview. The file will still be uploaded." 
          }));
        } finally {
          setIsProcessingImage(false);
          fileReaderRef.current = null;
        }
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        setErrors(prev => ({ 
          ...prev, 
          image: "Error reading image file. Please try a different file." 
        }));
        setFile(null);
        setImage(null);
        setIsProcessingImage(false);
        fileReaderRef.current = null;
      };

      reader.onabort = () => {
        console.log('FileReader aborted');
        setIsProcessingImage(false);
        fileReaderRef.current = null;
      };

      // Read the file as data URL - Chrome will handle this properly
      reader.readAsDataURL(selectedFile);

    } catch (error) {
      console.error('Unexpected error processing image:', error);
      setErrors(prev => ({ 
        ...prev, 
        image: "Unexpected error processing image. Please try again." 
      }));
      setFile(null);
      setImage(null);
      setIsProcessingImage(false);
      fileReaderRef.current = null;
    }
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    processImageFile(selected);
  }, [processImageFile]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const selected = event.dataTransfer.files?.[0];
    if (!selected) return;
    
    processImageFile(selected);
  }, [processImageFile]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const toggleBrandPicker = useCallback(() => {
    setBrandPickerOpen(!brandPickerOpen);
  }, [brandPickerOpen]);

  const handleLanguageChange = useCallback((value: string) => {
    const selectedLang = SUPPORTED_LANGUAGES.find(
      lang => lang.code === value
    ) || SUPPORTED_LANGUAGES[0];
    setSelectedLanguage(selectedLang);
  }, []);

  const handleCurrencyChange = useCallback((value: string) => {
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
  }, [priceFields, updateField]);

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!brand) {
      newErrors.brand = "Please select a brand";
    }

    if (!file) {
      newErrors.image = "Please upload a product image";
    } else {
      // Re-validate file on submit
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        newErrors.image = validation.message || "Invalid image file";
      }
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

      if (res.status===401){
        router.push("/login");
        return;
      }

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
    setBrand("");
    setFormData({});
    setBrandSearch("");
    
    // Clean up any FileReader
    if (fileReaderRef.current) {
      fileReaderRef.current.abort();
      fileReaderRef.current = null;
    }
  }

  const handleUploadAreaClick = useCallback(() => {
    if (!isProcessingImage && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isProcessingImage]);

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

      {/* LEFT: Image picker */}
      <div
        className="image-uploader"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleUploadAreaClick}
        role="button"
        aria-label="Upload image"
        tabIndex={0}
        style={{ 
          cursor: isProcessingImage ? 'wait' : 'pointer',
          opacity: isProcessingImage ? 0.7 : 1 
        }}
      >
        {image || isProcessingImage ? (
          <SafeImagePreview imageSrc={image} />
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">
              <span style={{fontSize:30}}>
                📎
              </span> 
            </div>
            <div className="upload-text">
              <p>Upload the product image</p>
              <span>PNG, JPG up to 5MB</span>
              {isProcessingImage && (
                <div className="processing-indicator">
                  <div className="processing-spinner"></div>
                  <span>Processing image...</span>
                </div>
              )}
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={isProcessingImage}
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
          <label htmlFor="brand" className="field-label">Brand *</label>
          <div className="picker-container">
            <button
              type="button"
              className={`picker-btn ${errors.brand ? 'error' : ''}`}
              onClick={toggleBrandPicker}
              disabled={isProcessingImage}
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
                  disabled={isProcessingImage}
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
                        <BrandLogo brand={b} size={24} />
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
            disabled={isProcessingImage}
          />
          {userEmail && !formData.email && (
            <div className="email-note">
              Using your account email. You can change it above.
            </div>
          )}
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        {/* Reserve vertical space to avoid CLS when brand fields appear */}
        <div className="dynamic-fields">
          {brand ? (
            <div className="form-grid">
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
                          disabled={isProcessingImage}
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
            <p className="brand-hint">Choose a brand to see its required fields.</p>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={!isFormValid || loading || isProcessingImage}
        >
          {loading ? "Generating..." : "Send receipt to my email"}
        </button>
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
          width: 100%;
          box-sizing: border-box;
        }
        
        .image-uploader:hover { background: #f0f0f0; }
        
        /* Reserve a stable preview area to avoid layout jumps when image loads */
        .image-preview-container {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 4 / 3;
          min-height: 280px;
          max-height: 500px;
        }
        
        .image-preview {
          max-width: 100%;
          max-height: 100%;
          border-radius: 12px;
          object-fit: contain;
          width: 100%;
          height: auto;
          display: block;
        }
        
        .image-loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.9);
          z-index: 10;
          border-radius: 12px;
        }
        
        .image-error-fallback {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
          color: #666;
        }
        
        .error-icon {
          color: #ff6b6b;
        }
        
        .error-subtext {
          font-size: 12px;
          color: #888;
          font-style: italic;
        }
        
        .upload-placeholder {
          color: #666;
          width: 100%;
        }
        
        .upload-icon {
          margin-bottom: 12px;
        }
        
        .upload-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
        }
        
        .upload-text p {
          margin: 0 0 4px 0;
          font-weight: 500;
        }
        
        .upload-text span {
          font-size: 14px;
          color: #888;
        }
        
        .processing-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          color: #666;
          font-size: 14px;
        }
        
        .processing-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #f0f0f0;
          border-top: 2px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .data-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          width: 100%;
        }
        
        /* Custom Select Styles - ORIGINAL STYLES RESTORED */
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
        
        /* Picker Styles - ORIGINAL STYLES RESTORED */
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
        
        /* INPUT STYLES RESTORED TO ORIGINAL */
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
        
        /* SIMPLIFIED Integer Input Styles - ORIGINAL STYLES */
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
        
        /* Reserve vertical space for dynamic fields to reduce layout shifts */
        .dynamic-fields {
          min-height: 220px;
          transition: min-height 220ms ease;
        }

        @media (max-width: 768px) {
          .dynamic-fields { min-height: 180px; }
        }

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
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .wrap {
            padding: 0 16px;
            gap: 20px;
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