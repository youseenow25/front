'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  popular?: boolean;
  features?: string[];
  billingPeriod?: string;
  originalPrice?: number;
  bestValue?: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  image: string;
}

interface PendingSubscriptionResponse {
  message: string;
  pending: {
    id: number;
    user_id: number;
    package_price: number;
    image_url: string;
    status: string;
    createdAt: string;
  };
}

// Currency exchange rates with custom Euro pricing
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 1, // We'll use custom pricing for EUR
  TRY: 32.5
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  TRY: '₺'
};

const CURRENCY_NAMES = {
  USD: 'US Dollar',
  EUR: 'Euro',
  TRY: 'Turkish Lira'
};

// Custom pricing for each currency
const CURRENCY_PRICING = {
  USD: {
    '1-receipt': 4.99,
    '1-day': 7.99,
    '1-week': 13.99,
    '1-month': 22.99,
    'lifetime': 39.99
  },
  EUR: {
    '1-receipt': 4.5,
    '1-day': 7,
    '1-week': 12,
    '1-month': 19.5,
    'lifetime': 34
  },
  TRY: {
    '1-receipt': 4.99 * 32.5,
    '1-day': 7.99 * 32.5,
    '1-week': 13.99 * 32.5,
    '1-month': 22.99 * 32.5,
    'lifetime': 39.99 * 32.5
  }
};

// Price mapping for backend API (the actual amounts to send)
const BACKEND_PRICE_MAPPING = {
  '1-receipt': 5,      // $5 for 1 receipt
  '1-day': 8,          // $8 for 1 day
  '1-week': 14,        // $14 for 1 week
  '1-month': 22,       // $22 for 1 month
  'lifetime': 40       // $40 for lifetime
};

// Crypto wallet addresses
const CRYPTO_ADDRESSES = {
  bitcoin: 'bc1qp72xxs2vfsae7u2a20fvlxyjunc32ucvclvq2rhegf69watmq2jshyheth',
  ethereum: '0x83B2AC765B0F72364590a5Ecd42b3E530a8f1447',
  litecoin: 'ltc1qqf5w4jnr32673keqlnm84qtx5hep4w6sllxlr5',
  dogecoin: 'DPdt3STZ6LHGxG84CGZFZ9CE87ckHVqSwX',
  solana: '2x2YoxwwbuNkZDxyFRsbPUXFMMD7fs2somYapZmv9Uq7'
};

const SubscriptionCheckout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [email, setEmail] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'TRY'>('EUR'); // Default to EUR
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [emailCopySuccess, setEmailCopySuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use useEffect to set email and user data from localStorage only once when component mounts
  useEffect(() => {
    const userString = localStorage.getItem("user");
    const authToken = localStorage.getItem("auth_token");
    
    if (authToken) {
      setToken(authToken);
    }
    
    if (userString) {
      try {
        const user = JSON.parse(userString); 
        const emailuser = user.email; 
        const userId = user.user_id;
        setEmail(emailuser);
        setUserId(userId);
        
        // Also try to get token from user object if not found in auth_token
        if (!authToken && user.token) {
          setToken(user.token);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleCopyAddress = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`Copied successfully!`);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy!');
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('moxnicpc@gmail.com');
      setEmailCopySuccess('Email copied successfully!');
      setTimeout(() => setEmailCopySuccess(null), 2000);
    } catch (err) {
      setEmailCopySuccess('Failed to copy email!');
      setTimeout(() => setEmailCopySuccess(null), 2000);
    }
  };

  const plans: Plan[] = [
    { 
      id: '1-receipt', 
      name: '1 Receipt', 
      price: 4.99, 
      description: 'Perfect for one-time use',
      features: ['Generate 1 professional receipt', 'All premium templates', 'Basic template'],
      billingPeriod: 'one time'
    },
    { 
      id: '1-day', 
      name: '1 Day Access', 
      price: 7.99, 
      description: 'Full access for 24 hours',
      features: ['Unlimited receipts for 1 day', 'All premium templates', 'Priority support'],
      billingPeriod: 'per day'
    },
    { 
      id: '1-week', 
      name: 'Weekly Access', 
      price: 13.99, 
      popular: true,
      description: 'Our most popular plan',
      features: ['Unlimited receipts for 7 days', 'All premium templates', 'Priority support'],
      billingPeriod: 'per week'
    },
    { 
      id: '1-month', 
      name: 'Monthly Pro', 
      price: 22.99, 
      description: 'Best for regular users',
      features: ['Unlimited receipts for 30 days', 'All premium templates', 'Priority support'],
      billingPeriod: 'per month'
    },
    { 
      id: 'lifetime', 
      name: 'Lifetime Access', 
      price: 39.99, 
      description: 'Never pay again',
      features: ['Lifetime unlimited receipts', 'All current & future templates', 'Dedicated support', 'Early access to new features'],
      billingPeriod: 'one time',
      bestValue: true
    },
  ];

  const paymentMethods: PaymentMethod[] = [
    { id: 'paypal', name: 'PayPal', image: '/paypal.png' },
    { id: 'bitcoin', name: 'Bitcoin', image: '/bitcoin.png' },
    { id: 'ethereum', name: 'Ethereum', image: '/etherum.png' },
    { id: 'litecoin', name: 'Litecoin', image: '/litecoin.png' },
    { id: 'dogecoin', name: 'Dogecoin', image: '/dogecoin.png' },
    { id: 'solana', name: 'Solana', image: '/solana.png' }
  ];

  // Get price based on selected currency
  const getPrice = (planId: string): number => {
    return CURRENCY_PRICING[selectedCurrency][planId as keyof typeof CURRENCY_PRICING.USD];
  };

  // Format price with currency symbol
  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };

  // Get backend price for API call
  const getBackendPrice = (planId: string): number => {
    return BACKEND_PRICE_MAPPING[planId as keyof typeof BACKEND_PRICE_MAPPING];
  };

  // Generate PayPal payment URL
  const getPayPalUrl = () => {
    if (!selectedPlan) return '#';
    
    const amount = getPrice(selectedPlan.id);
    const currency = selectedCurrency;
    
    // Fallback to email instructions
    const subject = `Payment for ${selectedPlan.name} - ${CURRENCY_SYMBOLS[selectedCurrency]}${amount} ${selectedCurrency}`;
    const body = `I want to purchase the ${selectedPlan.name} plan for ${CURRENCY_SYMBOLS[selectedCurrency]}${amount} ${selectedCurrency}.`;
    
    return `mailto:moxnicpc@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setError(null);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setError(null);
  };

  const handleCurrencyChange = (currency: 'USD' | 'EUR' | 'TRY') => {
    setSelectedCurrency(currency);
  };

  const handleScreenshotUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (PNG, JPG, JPEG)');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setScreenshot(file);
      setError(null);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedPlan && paymentMethod) {
      setCurrentStep(2);
      setError(null);
    } else if (currentStep === 2 && email && screenshot) {
      handleSubmitPayment();
    }
  };

  const handlePayPalClick = () => {
    if (!selectedPlan) {
      setError('Please select a plan first');
      return;
    }
    
    const paypalUrl = getPayPalUrl();
    window.open(paypalUrl, '_blank');
  };

  const handleSubmitPayment = async () => {
    if (!selectedPlan || !screenshot || !userId || !token) {
      setError('Missing required information');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', screenshot);
      
      // Use the backend price mapping instead of the display price
      const backendPrice = getBackendPrice(selectedPlan.id);
      formData.append('package_price', backendPrice.toString());
      
      console.log('Submitting payment with:', {
        displayPrice: selectedPlan.price,
        backendPrice: backendPrice,
        planId: selectedPlan.id,
        userId,
        hasToken: !!token,
        hasFile: !!screenshot
      });

      const response = await fetch('https://api.hubreceipts.com/api/receipt/pending-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        let errorData;
        try {
          errorData = errorText ? JSON.parse(errorText) : {};
        } catch (e) {
          throw new Error(`Server error: ${response.status}`);
        }
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result: PendingSubscriptionResponse = await response.json();
      console.log('Success response:', result);
      
      // Success - move to confirmation step
      setCurrentStep(3);
      
    } catch (err) {
      console.error('Error submitting payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    alert('Payment submitted successfully! You will receive a confirmation email once your subscription is activated.');
    // Redirect to dashboard or home page
    window.location.href = '/';
  };

  const getPaymentInstructions = () => {
    if (!paymentMethod || !selectedPlan) return '';
    
    const displayPrice = getPrice(selectedPlan.id);
    
    if (paymentMethod.id === 'paypal') {
      return (
        <div className="paypal-instructions">
          <div className="payment-details">
            <div className="amount-section">
              <span style={{fontSize:20}} className="amount-label">Send</span>
              <span style={{marginLeft:5,fontSize:20, fontWeight:'700'}} className="amount-value">{CURRENCY_SYMBOLS[selectedCurrency]}{formatPrice(displayPrice)} {selectedCurrency}</span>
              <span style={{marginLeft:5,fontSize:20}} >via PayPal to:</span>
              <div className="email-copy-container">
                <button
                  onClick={handleCopyEmail}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #e5e5e5",
                    borderRadius: 8,
                    background: "#f9f9f9",
                    cursor: "pointer",
                    fontSize: 20,
                    
                    flex: "0 0 auto",
                  }}
                >
                  🔗 moxnicpc@gmail.com
                </button>
                {/* Email Copy Success Notification */}
                {emailCopySuccess && (
                  <div className="copy-success-message email-copy-success">
                    {emailCopySuccess}
                  </div>
                )}
              </div>
            </div>
            
            <div style={{marginTop:15}} className="instructions-section">
              <h4 style={{fontSize:20, fontWeight:900}}>🚨 Important:</h4>
              <ul style={{marginTop:10}} className="instructions-list">
                <li>1. Send the money amount in EUR, the currencies are just for display</li>
                <li>2. Use Family & Friends option</li>
                <li>3. Do not include any notes</li>
              </ul>
            </div>
          </div>
        </div>
      );
    } else {
      // Crypto payment
      const cryptoAddress = CRYPTO_ADDRESSES[paymentMethod.id as keyof typeof CRYPTO_ADDRESSES];
      const cryptoName = paymentMethod.name;
      
      return (
        <div className="crypto-instructions">
          <div className="payment-header">
            
          </div>

          <div className="payment-details">
            <div className="amount-section">
              <div style={{display:'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px'}} className="amount-value">
                <span className="amount-label">Send </span>
                <span style={{fontWeight:'bold'}}>
                  {CURRENCY_SYMBOLS[selectedCurrency]}{formatPrice(displayPrice)} {selectedCurrency}
                </span>
                <span>
                  worth of
                </span>
                <span style={{fontWeight:'700'}}>
                  {cryptoName}
                </span>
              </div>
            </div>

            <div className="crypto-display">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop:10,
                  gap: "16px",
                }}
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${cryptoAddress}`}
                  alt={`${cryptoName} QR Code`}
                  style={{
                    width: 200,
                    height: 200,
                    objectFit: "contain",
                    flex: "0 0 auto",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: "0 1 auto",
                    minWidth: 0,
                  }}
                >
                  <button
                    onClick={() => handleCopyAddress(cryptoAddress)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #e5e5e5",
                      borderRadius: 8,
                      background: "#f9f9f9",
                      cursor: "pointer",
                      fontSize: 14,
                      flex: "0 0 auto",
                    }}
                  >
                    🔗 Copy address
                  </button>

                  <Image 
                    src={paymentMethod.image} 
                    alt={cryptoName}
                    width={35}
                    height={30}
                    className="payment-method-logo"
                  />

                  <span
                    title={cryptoAddress}
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 14,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {cryptoAddress}
                  </span>
                </div>
                {/* Copy Success Notification */}
                {copySuccess && (
                  <div className="copy-success-message">
                    {copySuccess}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const isStep1Valid = selectedPlan && paymentMethod;
  const isStep2Valid = email && screenshot;

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        {/* Header */}
        <div className="checkout-header">
          <h1 style={{fontSize:20}}>Choose your plan</h1>
          <p>Select the perfect plan for your receipt generation needs</p>
        </div>

        <div className="checkout-content">
          {/* Steps */}
          <div className="steps-container">
            <div className="steps">
              {[1, 2, 3].map((step) => (
                <div key={step} className="step-item">
                  <div className={`step-number ${currentStep >= step ? 'active' : ''}`}>
                    {currentStep > step ? '✓' : step}
                  </div>
                  <div className="step-label">
                    {step === 1 ? 'Plan' : step === 2 ? 'Payment' : 'Complete'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Step 1: Plan Selection */}
          {currentStep === 1 && (
            <div className="step-content">
              <div className="plans-section">
                <div className="plans-grid">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => handlePlanSelect(plan)}
                      className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''} ${plan.bestValue ? 'best-value' : ''}`}
                    >
                      {plan.bestValue && (
                        <div className="best-value-badge">BEST VALUE</div>
                      )}
                      {plan.popular && !plan.bestValue && (
                        <div className="popular-badge">Our most popular plan</div>
                      )}
                      
                      <div className="plan-header">
                        <div className="plan-title-section">
                          <h3 className="plan-name">{plan.name}</h3>
                          <p className="plan-description">{plan.description}</p>
                        </div>
                      </div>

                      <div className="plan-price-section">
                        <div className="price-main">
                          <span className="price-currency">{CURRENCY_SYMBOLS[selectedCurrency]}</span>
                          <span className="price-amount">{formatPrice(getPrice(plan.id))}</span>
                          <span className="price-period">/{plan.billingPeriod}</span>
                        </div>
                        
                        {/* Currency Selector for each plan */}
                        <div className="plan-currency-selector">
                          <div className="currency-buttons">
                            {(['USD', 'EUR', 'TRY'] as const).map((currency) => (
                              <button
                                key={currency}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent plan selection when clicking currency
                                  handleCurrencyChange(currency);
                                }}
                                className={`currency-button ${selectedCurrency === currency ? 'active' : ''}`}
                              >
                                {currency}
                              </button>
                            ))}
                          </div>
                        </div>

                        {plan.originalPrice && (
                          <div className="price-comparison">
                            <span className="original-price">{CURRENCY_SYMBOLS[selectedCurrency]}{formatPrice(getPrice(plan.id) * 1.2)}</span>
                            <span className="billed-annually">billed annually</span>
                          </div>
                        )}
                        {!plan.originalPrice && plan.billingPeriod === 'per month' && (
                          <div className="price-comparison">
                            <span className="billed-annually">billed monthly</span>
                          </div>
                        )}
                      </div>

                      <div className="plan-features">
                        {plan.features?.map((feature, index) => (
                          <div key={index} className="feature-item">
                            <span className="feature-check">✓</span>
                            <span className="feature-text">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className={`plan-select-indicator ${selectedPlan?.id === plan.id ? 'selected' : ''}`}>
                        {selectedPlan?.id === plan.id ? 'Selected' : 'Select'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="payment-methods-section">
                <h3 className="section-title">Select Payment Method</h3>
                <div className="methods-grid">
                  {/* PayPal takes full width */}
                  <div
                    onClick={() => handlePaymentMethodSelect(paymentMethods[0])}
                    className={`method-card paypal-card ${paymentMethod?.id === 'paypal' ? 'selected' : ''}`}
                  >
                    <div className="method-content">
                      <div className="method-icon-container">
                        <Image 
                          src={paymentMethods[0].image} 
                          alt={paymentMethods[0].name}
                          width={100}
                          height={100}
                          className="method-icon"
                        />
                      </div>
                      <span className="method-name">{paymentMethods[0].name}</span>
                    </div>
                    {paymentMethod?.id === 'paypal' && (
                      <div className="method-check">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Crypto methods in grid */}
                  {paymentMethods.slice(1).map((method) => (
                    <div
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method)}
                      className={`method-card ${paymentMethod?.id === method.id ? 'selected' : ''}`}
                    >
                      <div className="method-content">
                        <div className="method-icon-container">
                          <Image 
                            src={method.image} 
                            alt={method.name}
                            width={40}
                            height={40}
                            className="method-icon"
                          />
                        </div>
                        <span className="method-name">{method.name}</span>
                      </div>
                      {paymentMethod?.id === method.id && (
                        <div className="method-check">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-summary">
                <div className="summary-item">
                  <span>Plan</span>
                  <span>{selectedPlan ? selectedPlan.name : '-'}</span>
                </div>
                <div className="summary-item">
                  <span>Payment method</span>
                  <span>{paymentMethod ? paymentMethod.name : '-'}</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>
                    {selectedPlan ? 
                      `${CURRENCY_SYMBOLS[selectedCurrency]}${formatPrice(getPrice(selectedPlan.id))} ${selectedCurrency}` 
                      : `${CURRENCY_SYMBOLS[selectedCurrency]}0 ${selectedCurrency}`
                    }
                  </span>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                disabled={!isStep1Valid}
                className="continue-button"
              >
                Continue to payment
              </button>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {currentStep === 2 && (
            <div className="step-content">
              <div className="payment-section">
                <div className="payment-instructions">
                  <h3 className="section-title">Payment instructions</h3>
                  <div className="instructions-content">
                    {getPaymentInstructions()}
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-group">
                    <label>Email address</label>
                    <div className="email-display">
                      {email || 'No email found'}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="upload-label">Upload payment confirmation</label>
                    
                    {screenshotPreview ? (
                      <div className="screenshot-preview-container">
                        <div className="screenshot-preview">
                          <Image 
                            src={screenshotPreview} 
                            alt="Payment screenshot preview"
                            width={300}
                            height={200}
                            className="screenshot-image"
                          />
                          <div className="screenshot-info">
                            <div className="file-confirmation">
                              ✓ {screenshot?.name}
                            </div>
                            <button 
                              type="button"
                              onClick={handleRemoveScreenshot}
                              className="remove-screenshot-button"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={handleFileAreaClick}
                        className="file-upload-area"
                      >
                        <div className="upload-content">
                          <div className="upload-icon">📎</div>
                          <div className="upload-text">
                            <p>Upload payment screenshot</p>
                            <span>PNG, JPG up to 5MB</span>
                          </div>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotUpload}
                          className="file-input"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                disabled={!isStep2Valid || isLoading}
                className={`continue-button ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Complete payment'}
              </button>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="step-content">
              <div className="success-section">
                <div className="success-icon">✓</div>
                <h2>Payment submitted successfully!</h2>
                <p>
                  Your {selectedPlan?.name.toLowerCase()} subscription request has been received. 
                  You'll receive a confirmation email once your payment is verified and your subscription is activated.
                </p>
                <button
                  onClick={handleFinish}
                  className="finish-button"
                >
                  Go to dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .qr-container {
          text-align: center;
          padding: 20px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e6e6e6;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .qr-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .crypto-actions {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .copy-address-button {
          padding: 10px 20px;
          background: #000;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .copy-address-button:hover {
          background: #333;
        }

        .crypto-address-full {
          font-size: 14px;
          font-weight: 500;
          color: #666;
          font-family: 'Courier New', monospace;
          word-break: break-all;
          text-align: center;
          width: 100%;
          max-width: 300px;
        }

        .checkout-container {
          min-height: 100vh;
          background: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .checkout-card {
          width: 100%;
          max-width: 1000px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e6e6e6;
          overflow: hidden;
        }

        .checkout-header {
          padding: 20px 20px 24px;
          border-bottom: 1px solid #f0f0f0;
          text-align: center;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .checkout-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px 0;
        }

        .checkout-header p {
          font-size: 16px;
          color: #666;
          margin: 0;
        }

        .checkout-content {
          padding: 40px;
        }

        .steps-container {
          margin-bottom: 10px;
        }

        .steps {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 60px;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: #999;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .step-number.active {
          background: #000;
          color: white;
          border-color: #000;
        }

        .step-label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

     
        .error-message {
          background: #fed7d7;
          color: #c53030;
          padding: 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 20px;
          border: 1px solid #feb2b2;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .plan-card {
          border: 2px solid #e6e6e6;
          border-radius: 16px;
          padding: 28px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          background: white;
          display: flex;
          flex-direction: column;
          height: fit-content;
        }

        .plan-card:hover {
          border-color: #ccc;
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        }

        .plan-card.selected {
          border-color: #000;
          background: #fafafa;
        }

        .plan-card.popular {
          border-color: #666;
        }

        .plan-card.best-value {
          border-color: #000;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .best-value-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #000;
          color: white;
          padding: 8px 24px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #666;
          color: white;
          padding: 6px 20px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          text-transform: uppercase;
        }

        .plan-header {
          margin-bottom: 24px;
          text-align: center;
        }

        .plan-name {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px 0;
          line-height: 1.2;
        }

        .plan-description {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        .plan-price-section {
          text-align: center;
          margin-bottom: 24px;
          padding: 24px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .price-main {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
          margin-bottom: 16px;
        }

        .price-currency {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .price-amount {
          font-size: 42px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
        }

        .price-period {
          font-size: 18px;
          color: #666;
          font-weight: 500;
        }

        .plan-currency-selector {
          margin: 16px 0;
        }

        .currency-buttons {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .currency-button {
          padding: 6px 12px;
          border: 1px solid #e6e6e6;
          border-radius: 8px;
          background: white;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 50px;
        }

        .currency-button:hover {
          border-color: #ccc;
        }

        .currency-button.active {
          background: #000;
          color: white;
          border-color: #000;
        }

        .price-comparison {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin-top: 12px;
        }

        .original-price {
          font-size: 14px;
          color: #666;
          text-decoration: line-through;
        }

        .billed-annually {
          font-size: 12px;
          color: #666;
        }

        .plan-features {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
          flex: 1;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .feature-check {
          color: #000;
          font-weight: 600;
          font-size: 14px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .feature-text {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        .plan-select-indicator {
          padding: 14px 18px;
          background: #f0f0f0;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          text-align: center;
          font-size: 15px;
          font-weight: 600;
          color: #666;
          transition: all 0.2s ease;
          margin-top: auto;
        }

        .plan-select-indicator.selected {
          background: #000;
          color: white;
        }

        .payment-methods-section {
          margin-top: 16px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 20px 0;
        }

        .methods-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .method-card {
          border: 2px solid #e6e6e6;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          background: white;
        }

        .method-card:hover {
          border-color: #ccc;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .method-card.selected {
          border-color: #000;
          background: #fafafa;
        }

        .paypal-card {
          padding: 24px;
          grid-column: 1;
        }

        .method-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .paypal-card .method-content {
          gap: 20px;
        }

        .method-icon-container {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e6e6e6;
        }

        .paypal-card .method-icon-container {
          width: 56px;
          height: 56px;
        }

        .method-icon {
          object-fit: contain;
        }

        .paypal-card .method-icon {
          width: 40px;
          height: 40px;
        }

        .method-name {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .paypal-card .method-name {
          font-size: 18px;
          font-weight: 700;
        }

        .method-check {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #000;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .order-summary {
          border-top: 1px solid #f0f0f0;
          padding-top: 24px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 15px;
        }

        .summary-item span:first-child {
          color: #666;
        }

        .summary-item span:last-child {
          color: #1a1a1a;
          font-weight: 500;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 2px solid #f0f0f0;
          font-weight: 700;
          font-size: 18px;
          color: #1a1a1a;
        }

        .continue-button {
          width: 100%;
          padding: 18px;
          background: #000;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .continue-button:hover:not(:disabled) {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .continue-button:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .continue-button.loading {
          background: #666;
        }

        .payment-instructions {
          margin-bottom: 32px;
        }

        .instructions-content {
          background: #fafafa;
          border: 1px solid #e6e6e6;
          border-radius: 16px;
          padding: 28px;
          font-size: 14px;
          line-height: 1.6;
          color: #666;
        }

        .payment-header {
          margin-bottom: 24px;
        }

        .payment-method-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .payment-method-logo {
          border-radius: 12px;
        }

        .payment-method-info h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 4px 0;
        }

        .payment-method-info p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .payment-details {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .amount-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e6e6e6;
        }

        .amount-label {
          font-size: 14px;
          color: #666;
        }

        .amount-value {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .instructions-section {
          padding: 16px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e6e6e6;
        }

        .instructions-section h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 12px 0;
        }

        .instructions-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .instructions-list li {
          padding: 8px 0;
          font-size: 14px;
          color: #666;
        }

        .instructions-list strong {
          color: #1a1a1a;
          font-weight: 600;
        }

        .recipient-section {
          padding: 16px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e6e6e6;
        }

        .recipient-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
          display: block;
        }

        .recipient-address {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .email-address-container {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .email-address {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          flex: 1;
        }

        .copy-email-button {
          padding: 8px 12px;
          background: #f8f9fa;
          border: 1px solid #e6e6e6;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .copy-email-button:hover {
          background: #e9ecef;
        }

        .paypal-action-button {
          padding: 10px 20px;
          background: #0070ba;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .paypal-action-button:hover {
          background: #005ea6;
        }

        .crypto-display {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .crypto-address-display {
          padding: 20px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e6e6e6;
        }

        .crypto-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .crypto-name {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .qr-section {
          display: flex;
          justify-content: center;
        }

        .crypto-qr {
          border-radius: 8px;
          border: 1px solid #e6e6e6;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-group label {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .upload-label {
          font-size: 18px !important;
        }

        .email-display {
          padding: 14px 18px;
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .file-upload-area {
          border: 2px dashed #e6e6e6;
          border-radius: 12px;
          padding: 32px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .file-upload-area:hover {
          border-color: #ccc;
          background: #fafafa;
        }

        .upload-content {
          display: flex;
          align-items: center;
          gap: 16px;
          justify-content: center;
        }

        .upload-icon {
          font-size: 24px;
          color: #666;
        }

        .upload-text p {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 6px 0;
        }

        .upload-text span {
          font-size: 14px;
          color: #666;
        }

        .file-input {
          display: none;
        }

        .screenshot-preview-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .screenshot-preview {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }

        .screenshot-image {
          object-fit: contain;
          border-radius: 12px;
          border: 1px solid #e6e6e6;
        }

        .screenshot-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 300px;
        }

        .file-confirmation {
          font-size: 15px;
          color: #000;
          font-weight: 600;
        }

        .remove-screenshot-button {
          padding: 8px 16px;
          background: #e53e3e;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .remove-screenshot-button:hover {
          background: #c53030;
        }

        .success-section {
          text-align: center;
          padding: 60px 40px;
        }

        .success-icon {
          font-size: 64px;
          color: #000;
          margin-bottom: 24px;
        }

        .success-section h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 16px 0;
        }

        .success-section p {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          margin: 0 0 32px 0;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .finish-button {
          padding: 16px 40px;
          background: #000;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .finish-button:hover {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        /* Copy Success Message Styles */
        .copy-success-message {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #000;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: slideIn 0.3s ease;
        }

        .email-copy-container {
          position: relative;
          display: inline-block;
        }

        .email-copy-success {
          position: absolute;
          top: -40px;
          right: 0;
          background: #000;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
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

        @media (max-width: 768px) {
          .checkout-card {
            margin: 0;
            border-radius: 0;
            border: none;
            box-shadow: none;
          }

          .checkout-content {
            padding: 24px;
          }

          .checkout-header {
            padding: 32px 24px 20px;
          }

          .checkout-header h1 {
            font-size: 24px;
          }

          .steps {
            gap: 40px;
          }

          .plans-grid {
            grid-template-columns: 1fr;
          }

          .methods-grid {
            grid-template-columns: 1fr;
          }

          .plan-header {
            text-align: left;
          }

          .plan-price-section {
            text-align: left;
          }

          .price-main {
            justify-content: flex-start;
          }

          .currency-buttons {
            justify-content: flex-start;
          }

          .price-comparison {
            align-items: flex-start;
          }

          .screenshot-info {
            flex-direction: column;
            gap: 12px;
            align-items: center;
          }

          .payment-method-header {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .recipient-address {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .email-address-container {
            justify-content: space-between;
          }

          .success-section {
            padding: 40px 20px;
          }

          .copy-success-message {
            top: 10px;
            right: 10px;
            left: 10px;
            text-align: center;
          }

          .email-copy-success {
            top: -35px;
            right: 50%;
            transform: translateX(50%);
          }
        }

        @media (max-width: 480px) {
          .steps {
            gap: 20px;
          }

          .step-item {
            gap: 8px;
          }

          .step-label {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default SubscriptionCheckout;