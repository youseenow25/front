'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check, ChevronDown, ChevronUp, Eye, X, Download, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        const email = user?.email;
        
        setIsLoggedIn(!!email);
        setUserEmail(email);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsLoggedIn(false);
        setUserEmail(null);
      }
    };

    checkAuth();
    
    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Load receipt preview from localStorage
  useEffect(() => {
    const loadReceiptPreview = () => {
      try {
        const pendingReceipt = localStorage.getItem('pendingReceipt');
        if (pendingReceipt) {
          const receiptData = JSON.parse(pendingReceipt);
          if (receiptData.generatedHtml) {
            setReceiptPreview(receiptData.generatedHtml);
            setReceiptData(receiptData);
          }
        }
      } catch (error) {
        console.error('Error loading receipt preview:', error);
      }
    };

    loadReceiptPreview();
    
    // Also listen for storage changes for the receipt
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pendingReceipt') {
        loadReceiptPreview();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Create a beautiful preview card with receipt data
  const createReceiptPreviewCard = (data: any) => {
    if (!data || !data.formData) {
      return '<div style="padding: 40px; text-align: center; color: #666; background: white; border-radius: 12px;">No receipt data available</div>';
    }

    const { formData } = data;
    const { brand, email, currency, otherFields } = formData;
    
    return `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 500px; margin: 0 auto; border: 2px solid #e8f4fd; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1c73e7 0%, #2d8cff 100%); color: white; padding: 20px; text-align: center;">
          <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">RECEIPT PREVIEW</div>
          <h2 style="margin: 0; font-size: 22px; font-weight: 700;">${brand || 'Online Purchase'}</h2>
          <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Ready to Download</div>
        </div>
        
        <!-- Content -->
        <div style="padding: 24px;">
          <!-- Email -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
            <span style="font-weight: 600; color: #555;">Email:</span>
            <span style="color: #1c73e7; font-weight: 500;">${email || 'N/A'}</span>
          </div>
          
          <!-- Product -->
          ${otherFields?.product_name ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
              <span style="font-weight: 600; color: #555;">Product:</span>
              <span style="color: #333; font-weight: 500;">${otherFields.product_name}</span>
            </div>
          ` : ''}
          
          <!-- Price -->
          ${otherFields?.product_price ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
              <span style="font-weight: 600; color: #555;">Price:</span>
              <span style="color: #27ae60; font-weight: 600;">${currency || '$'}${otherFields.product_price}</span>
            </div>
          ` : ''}
          
          <!-- Seller -->
          ${otherFields?.seller_name ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
              <span style="font-weight: 600; color: #555;">Seller:</span>
              <span style="color: #333; font-weight: 500;">${otherFields.seller_name}</span>
            </div>
          ` : ''}
          
          <!-- Total -->
          ${otherFields?.total ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; background: #f8f9fa; margin: 16px -24px -24px -24px; padding: 20px 24px; border-top: 2px solid #e9ecef;">
              <span style="font-weight: 700; color: #2c3e50; font-size: 16px;">Total Amount:</span>
              <span style="color: #27ae60; font-weight: 700; font-size: 18px;">${currency || '$'}${otherFields.total}</span>
            </div>
          ` : ''}
        </div>
        
        <!-- Footer Note -->
        <div style="background: #fff8e6; padding: 12px; text-align: center; border-top: 1px solid #ffeaa7;">
          <div style="color: #e67e22; font-size: 11px; font-weight: 600;">
            ⚡ PREVIEW - Purchase to download full receipt
          </div>
        </div>
      </div>
    `;
  };

  // Add watermark to receipt HTML
  const addWatermarkToReceipt = (html: string) => {
    const watermarkedHtml = `
      <div style="position: relative; display: inline-block; width: 100%; min-height: 500px;">
        ${html}
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          background: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 25px,
            rgba(255, 0, 0, 0.04) 25px,
            rgba(255, 0, 0, 0.04) 50px
          );
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 52px;
          font-weight: 900;
          color: rgba(255, 0, 0, 0.12);
          pointer-events: none;
          z-index: 10000;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 6px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        ">PREVIEW ONLY</div>
       
        <div style="
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.85);
          color: white;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          pointer-events: none;
          z-index: 10000;
          backdrop-filter: blur(4px);
        ">Generated by HubReceipts.com - Not a valid receipt</div>
      </div>
    `;
    return watermarkedHtml;
  };

  // Clear receipt preview
  const clearReceiptPreview = () => {
    localStorage.removeItem('pendingReceipt');
    setReceiptPreview(null);
    setReceiptData(null);
    setShowPreview(false);
  };

  // ✅ Handle checkout with proper authentication
  const handleCheckout = async (productId: string) => {
    try {
      setLoadingPlan(productId);

      // Double-check authentication before proceeding
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      const email = user?.email;

      if (!email) {
        alert('Please log in to proceed with checkout.');
        router.push("/register");
        return;
      }

      const response = await fetch('https://api.hubreceipts.com/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Checkout failed: ${response.status}`);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      
      if (err.message.includes('authentication') || err.message.includes('401')) {
        alert('Session expired. Please log in again.');
        router.push("/register");
      } else if (err.message.includes('400')) {
        alert('Invalid request. Please try again.');
      } else {
        alert(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  const topRowPlans = [
    {
      id: '1-receipt',
      name: '1 Receipt',
      priceusd: 4.99,
      priceeur: 4.5,
      description: 'Perfect for trying out our generator.',

    },
    {
      id: '1-day',
      name: '1 Day Access',
      priceusd: 8.99,
      priceeur: 7.99,
      description: '24 hours of unlimited access.',
    },
    {
      id: '1-week',
      name: '1 Week Access',
      priceusd: 14.99,
      priceeur: 12.99,
      description: 'Ideal for short-term projects.',

    },
  ];

  const bottomRowPlans = [
    {
      id: '1-month',
      name: '1 Month',
      priceusd: 21.99,
      priceeur: 20.99,
      description: 'Best for regular business use.',
   
    },
    {
      id: '6-months',
      name: '6 Months',
      priceusd: 39.99,
      priceeur: 34.99,
      description: 'Maximum value for power users.',
    
    },
  ];

  const renderPlanCard = (plan: any) => (
    <div
      key={plan.id}
      className={`relative rounded-2xl border-2 bg-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
        plan.popular ? 'border-yellow-400 shadow-lg' : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 right-4">
          <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md">
            {plan.badge}
          </span>
        </div>
      )}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
          <span className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 text-white text-sm font-bold rounded-full shadow-lg">
            🏆 Most Popular
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-0">{plan.name}</h2>
        <p className="text-gray-600 mb-2 leading-relaxed">{plan.description}</p>

        <div className="flex items-baseline justify-center space-x-0 mb-0">
          <span  className="text-4xl font-light text-gray-900">€{plan.priceeur}</span>
          <span style={{marginLeft:4}} className="text-2xl text-gray-400"> / </span>
          <span style={{marginLeft:6}}  className="text-4xl font-light text-gray-900"> ${plan.priceusd}</span>
        </div>

        <p className="text-sm text-gray-500 text-center mb-2">One-time payment • No auto-renewal</p>

        <div className="mt-2">
          <button
          style={{background:'#0074d4'}}
            onClick={() => handleCheckout(plan.id)}
            disabled={loadingPlan === plan.id || !isLoggedIn}
            className="w-full bg-gradient-to-r  hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-0  transition-all duration-300 transform hover:shadow-lg disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center"
          >
            {!isLoggedIn ? (
              <>
                <ShoppingCart size={18} />
                Login to Purchase
              </>
            ) : loadingPlan === plan.id ? (
              <>
                <div className="animate-spin rounded-full h-2 w-2 border-0 border-white border-t-transparent"></div>
                Redirecting...
              </>
            ) : (
              <>
              <span style={{color:'white'}} >
                 Pay with Apple Pay + 3

              </span>
           
               
              </>
            )}
          </button>
          
          {!isLoggedIn && (
            <p className="mt-3 text-xs text-red-600 text-center font-medium">
              Please log in to purchase
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Enhanced Receipt Preview Modal - Shows Full Receipt Immediately */}
      {showPreview && receiptPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
           
              </div>
              <div className="flex gap-3">
                <button
                  onClick={clearReceiptPreview}
                  className="px-5 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-colors flex items-center gap-2 font-semibold"
                >
                  <X size={18} />
                  Close
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(95vh-120px)] bg-gray-50">
              {/* Show Full Receipt with Watermark Immediately */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-yellow-600">
                    <Eye size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Preview Mode</h4>
                    <p className="text-yellow-700 text-sm">This is a watermarked preview. Purchase any plan to sent the receipt to your email without watermarks.</p>
                  </div>
                </div>
              </div>
              
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: addWatermarkToReceipt(receiptPreview) 
                }}
                className="receipt-preview bg-white p-6 rounded-xl border-2 border-blue-100 shadow-inner"
              />
              
              {/* Call to Action Section */}
              <div className="text-center mt-8 bg-white rounded-2xl p-8 border-2 border-dashed border-green-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to send the receipt to your email?</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-lg">
                  Purchase any plan to download this receipt without watermarks and get full access to our receipt generator.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => {
                      setShowPreview(false);
                      // Scroll to pricing plans
                      document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 font-bold text-lg shadow-lg"
                  >
                  
                    Choose Plan 
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Receipt Preview Banner */}
      {receiptPreview && !showPreview && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-5 shadow-lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              
              <div>
                <h3 className="text-xl font-bold">Your Receipt is Ready! 🎉</h3>
                <p className="text-blue-100 mt-1">
                  Preview your generated receipt and purchase to download the clean version
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowPreview(true)}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-bold shadow-lg"
              >
                <Eye size={18} />
                View Receipt Preview
              </button>
             
            </div>
          </div>
        </div>
      )}

      {/* Authentication Status Banner */}
      {!isLoggedIn && !receiptPreview && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 text-center">
          <p className="text-sm font-medium">
            Please <button onClick={() => router.push("/register")} className="underline font-bold bg-white/20 px-2 py-1 rounded">log in</button> to purchase a plan
          </p>
        </div>
      )}

      {/* Main Content */}
      <div style={{marginTop:10}}  className="flex-1">
        {/* Hero Section */}
       

        {/* Top Row Plans */}
        <section id="pricing-plans" className="mx-auto w-full max-w-6xl px-2 pb-2">
          <div className="grid gap-2 lg:grid-cols-3">
            {topRowPlans.map(renderPlanCard)}
          </div>
        </section>

        {/* Bottom Row Plans */}
        <section className="mx-auto w-full max-w-4xl px-6 pb-20">
          <div className="grid gap-8 lg:grid-cols-2">
            {bottomRowPlans.map(renderPlanCard)}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}