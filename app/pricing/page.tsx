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

  // Transform receipt HTML to look like email client display
  const transformReceiptForEmailDisplay = (html: string) => {
    // Remove complex styling and make it look like email client rendering
    let transformedHtml = html
      // Remove position:absolute elements (watermarks, overlays)
      .replace(/<div[^>]*style="[^"]*position:\s*absolute[^>]*>[\s\S]*?<\/div>/g, '')
      // Remove complex backgrounds and gradients
      .replace(/background:[^;"]*;?/g, '')
      .replace(/background-[^:;"]*:[^;"]*;?/g, '')
      // Remove box-shadows and complex effects
      .replace(/box-shadow:[^;"]*;?/g, '')
      .replace(/text-shadow:[^;"]*;?/g, '')
      .replace(/backdrop-filter:[^;"]*;?/g, '')
      .replace(/transform:[^;"]*;?/g, '')
      // Remove complex positioning
      .replace(/position:[^;"]*;?/g, '')
      .replace(/z-index:[^;"]*;?/g, '')
      .replace(/pointer-events:[^;"]*;?/g, '')
      // Simplify borders
      .replace(/border[^:]*:[^;"]*;?/g, 'border: 1px solid #e0e0e0;')
      // Make it more email-like with simpler styling
      .replace(/style="([^"]*)"/g, (match: string, style: string) => {
        // Keep only essential styles for email display
        const essentialStyles = style
          .split(';')
          .filter(styleRule => {
            const prop = styleRule.split(':')[0]?.trim();
            return [
              'color',
              'font-size',
              'font-weight',
              'text-align',
              'padding',
              'margin',
              'width',
              'height',
              'border',
              'background-color',
              'display'
            ].includes(prop);
          })
          .join(';');
        
        return `style="${essentialStyles}"`;
      });

    // Wrap in email-like container
    transformedHtml = `
      <div style="
        max-width: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.4;
        color: #333;
        background: #f8f9fa;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
      ">
        <div style="
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        ">
          ${transformedHtml}
        </div>
        <div style="
          text-align: center;
          margin-top: 16px;
          padding: 12px;
          background: #fff8e6;
          border: 1px solid #ffeaa7;
          border-radius: 6px;
          font-size: 12px;
          color: #e67e22;
        ">
          🔒 Preview - Purchase to get clean version without watermarks
        </div>
      </div>
    `;

    return transformedHtml;
  };

  // Add subtle watermark for email-like preview
  const addEmailStyleWatermark = (html: string) => {
    return `
      <div style="position: relative;">
        ${html}
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 32px;
          font-weight: 300;
          color: rgba(0, 0, 0, 0.08);
          pointer-events: none;
          z-index: 100;
          white-space: nowrap;
          opacity: 0.6;
        ">PREVIEW</div>
      </div>
    `;
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
      {/* Content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-0">{plan.name}</h2>
        <p className="text-gray-600 mb-2 leading-relaxed">{plan.description}</p>

        <div className="flex items-baseline justify-center space-x-0 mb-0">
          <span className="text-4xl font-light text-gray-900">€{plan.priceeur}</span>
          <span style={{marginLeft:4}} className="text-2xl text-gray-400"> / </span>
          <span style={{marginLeft:6}} className="text-4xl font-light text-gray-900"> ${plan.priceusd}</span>
        </div>

        <p className="text-sm text-gray-500 text-center mb-2">One-time payment • No auto-renewal</p>

        <div className="mt-2">
          <button
            style={{background:'#0074d4'}}
            onClick={() => handleCheckout(plan.id)}
            disabled={loadingPlan === plan.id || !isLoggedIn}
            className="w-full bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-0 transition-all duration-300 transform hover:shadow-lg disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center rounded-lg"
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
                <span style={{color:'white'}}>
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
      
      {/* Email-style Receipt Preview Modal */}
      {showPreview && receiptPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-full sm:max-w-2xl max-h-[90vh] overflow-hidden shadow-lg border border-gray-300 mx-2 sm:mx-0">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Receipt Preview</h2>
                <p className="text-gray-600 mt-1 text-sm">
                  How it will look in your email
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={clearReceiptPreview}
                  className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 font-medium text-sm"
                >
                  <X size={16} />
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>
            </div>
            <div className="p-3 sm:p-4 overflow-auto max-h-[calc(90vh-80px)] bg-gray-50">
              
              {/* Email-style Receipt Display */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: addEmailStyleWatermark(transformReceiptForEmailDisplay(receiptPreview)) 
                  }}
                  className="email-receipt-preview"
                />
              </div>
              
              {/* Simple Call to Action */}
              <div className="text-center mt-4 bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to get the clean version?</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Purchase any plan to receive this receipt in your email without watermarks
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                  <button
                    onClick={() => {
                      setShowPreview(false);
                      document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 font-medium text-sm w-full sm:w-auto justify-center"
                  >
                    Choose Plan
                  </button>
                  <button
                    onClick={clearReceiptPreview}
                    className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm w-full sm:w-auto"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Receipt Preview Banner */}
      {receiptPreview && !showPreview && (
        <div className="bg-blue-600 text-white py-3 px-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between max-w-7xl mx-auto gap-2 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold">Receipt Ready for Preview</h3>
                <p className="text-blue-100 mt-1 text-xs sm:text-sm hidden sm:block">
                  See how it will look when delivered to your email
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setShowPreview(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all flex items-center gap-2 font-medium text-sm w-full sm:w-auto justify-center"
              >
                <Eye size={16} />
                Preview Email View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Status Banner */}
      {!isLoggedIn && !receiptPreview && (
        <div className="bg-amber-500 text-white py-2 px-4 text-center">
          <p className="text-sm font-medium">
            Please <button onClick={() => router.push("/register")} className="underline font-bold bg-white/20 px-2 py-1 rounded">log in</button> to purchase a plan
          </p>
        </div>
      )}

      {/* Main Content */}
      <div style={{marginTop:10}} className="flex-1">
        {/* Top Row Plans */}
        <section id="pricing-plans" className="mx-auto w-full max-w-6xl px-2 sm:px-2 pb-2">
          <div className="grid gap-2 sm:gap-2 lg:grid-cols-3">
            {topRowPlans.map(renderPlanCard)}
          </div>
        </section>

        {/* Bottom Row Plans */}
        <section className="mx-auto w-full max-w-4xl px-2 sm:px-6 pb-20">
          <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
            {bottomRowPlans.map(renderPlanCard)}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}