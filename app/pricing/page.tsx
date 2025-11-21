'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check } from 'lucide-react';
import { useState } from 'react';

import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

   const router = useRouter();

  // ✅ Handle checkout
  const handleCheckout = async (productId: string) => {
    try {
      setLoadingPlan(productId);

      
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      const email = user?.email || null;

      const response = await fetch('https://api.hubreceipts.com/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email }),
      });

      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url; 
      } else {
          router.push("/register");

       
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const topRowPlans = [
    {
      id: '1-receipt',
      name: '1 Receipt',
      price: 3.99,
      description: 'Perfect for trying out our generator.',
      features: ['1 professional receipt', 'All templates'],
      badge: 'Pay per use'
    },
    {
      id: '1-day',
      name: 'Day Pass',
      price: 6.99,
      description: '24 hours of unlimited access.',
      features: ['Unlimited receipts for 24 hours', 'All templates'],
    },
    {
      id: '1-week',
      name: 'Weekly',
      price: 10.99,
      description: 'Ideal for short-term projects.',
      features: ['7 days unlimited access', 'All templates', 'Priority support'],
      badge: 'Most Flexible'
    },
  ];

  const bottomRowPlans = [
    {
      id: '1-month',
      name: '1 Month',
      price: 17.99,
      description: 'Best for regular business use.',
      popular: true,
      features: ['30 days unlimited access', 'All premium features', 'Dedicated support'],
    },
    {
      id: '6-months',
      name: '6 Months',
      price: 33.99,
      description: 'Maximum value for power users.',
      features: ['6 months unlimited access', 'All enterprise features', '24/7 dedicated support'],
      badge: 'Best Value'
    },
  ];

  const renderPlanCard = (plan: any) => (

    
    <div
      key={plan.id}
      className={`relative rounded-2xl border bg-white transition hover:shadow-lg ${
        plan.popular ? 'border-yellow-400 shadow-md scale-[1.02]' : 'border-gray-200'
      }`}
    >
     
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 right-4">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            {plan.badge}
          </span>
        </div>
      )}
      {plan.popular && (
        <div className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <span className="bg-green-600 px-4 py-2 text-white text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-8">
        <h2 className="text-3xl font-semibold text-gray-900">{plan.name}</h2>
        <p className="mt-2 text-gray-600">{plan.description}</p>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="text-5xl font-light text-gray-900">€{plan.price}</span>
        </div>

        <p className="mt-1 text-sm text-gray-500">One-time payment • No auto-renewal</p>

        <div className="mt-2">
          <button
          style={{backgroundColor:'#1c73e7'}}
            onClick={() => handleCheckout(plan.id)}
            disabled={loadingPlan === plan.id}
            className="block w-full rounded-lg px-2 py-2 text-center font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loadingPlan === plan.id ? 'Redirecting...' : `Pay with Apple Pay + 3 options`}
          </button>
        </div>
      </div>

      {/* Features */}
      <ul className="grid gap-1 border-t border-gray-200 p-3 text-sm">
        {plan.features.map((feature: string) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header  />
       <span style={{fontSize:20, textAlign:'center', marginTop:5}} >
        💬 If you dont like the result we give you back the money
      </span>

      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 pt-2 text-center">

     
      </section>

      {/* Top Row */}
      <section className="mx-auto w-full max-w-0xl px-6 pb-5">
        <div className="grid gap-1 lg:grid-cols-3">
          {topRowPlans.map(renderPlanCard)}
        </div>
      </section>

      {/* Bottom Row */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {bottomRowPlans.map(renderPlanCard)}
        </div>
      </section>

      <Footer />
    </div>
  );
}

