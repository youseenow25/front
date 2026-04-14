'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
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

      const response = await fetch('https://api.repsreceipt.com/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, email }),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMsg = `Checkout failed: ${response.status}`;
        try { errorMsg = JSON.parse(text).error || errorMsg; } catch {}
        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      const message = err?.message || '';

      if (message.includes('authentication') || message.includes('401')) {
        alert('Session expired. Please log in again.');
        router.push("/register");
      } else if (message.includes('400')) {
        alert('Invalid request. Please try again.');
      } else {
        alert(message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  const topRowPlans = [
    {
      id: '1-receipt',
      name: '1 Receipt',
      priceusd: 5.99,
      description: 'Perfect for trying out our generator.',
    },
    {
      id: '1-day',
      name: '1 Day Access',
      priceusd: 8.99,
      description: '24 hours of unlimited access.',
    },
  ];

  const bottomRowPlans = [
    {
      id: 'Lifetime',
      name: 'Lifetime',
      priceusd: 29.99,
      description: 'Lifetime access to all features',
      badge: 'BEST VALUE',
    },
  ];

  const renderPlanCard = (plan: any) => (
    <div
      key={plan.id}
      className={`relative rounded-2xl border-2 bg-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] ${
        plan.popular ? 'border-blue-500 shadow-xl ring-4 ring-blue-100' : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 right-6">
          <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
            ✨ {plan.badge}
          </span>
        </div>
      )}
      {plan.popular && (
        <div className="absolute -top-5 left-1/2 z-10 -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-white text-sm font-bold rounded-full shadow-xl">
            🏆 Most Popular
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h2>
        <p className="text-gray-600 mb-6 leading-relaxed text-base">{plan.description}</p>

        <div className="flex items-baseline justify-center mb-2">
          <span className="text-5xl font-bold text-gray-900">${plan.priceusd}</span>
        </div>

        <p className="text-sm text-gray-500 text-center mb-6 font-medium">One-time payment • No auto-renewal</p>

        <div className="mt-4">
          <button
            onClick={() => handleCheckout(plan.id)}
            disabled={loadingPlan === plan.id || !isLoggedIn}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {!isLoggedIn ? (
              <>
                <ShoppingCart size={20} />
                Login to Purchase
              </>
            ) : loadingPlan === plan.id ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span className="ml-2">Redirecting...</span>
              </>
            ) : (
              <>
                Pay with Apple Pay + 3
              </>
            )}
          </button>

          {!isLoggedIn && (
            <p className="mt-4 text-sm text-red-600 text-center font-semibold">
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
      
      {/* Authentication Status Banner */}
      {!isLoggedIn && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 text-center">
          <p className="text-sm font-medium">
            Please <button onClick={() => router.push("/register")} className="underline font-bold bg-white/20 px-2 py-1 rounded">log in</button> to purchase a plan
          </p>
        </div>
      )}

      {/* Main Content */}
      <div style={{marginTop:10}} className="flex-1">
        {/* Hero Section */}
        <div className="text-center py-12 px-4">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate professional receipts for any brand. Simple pricing, no hidden fees.
          </p>
        </div>

        {/* Top Row Plans */}
        <section id="pricing-plans" className="mx-auto w-full max-w-6xl px-6 pb-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {topRowPlans.map(renderPlanCard)}
          </div>
        </section>

        {/* Bottom Row Plans - Centered */}
        <section className="mx-auto w-full max-w-2xl px-6 pb-20">
          <div className="grid gap-8 lg:grid-cols-1">
            {bottomRowPlans.map(renderPlanCard)}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}