'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const link = 'https://discord.gg/2ZRQu2uT62';

  const topRowPlans = [
    {
      id: '1-receipt',
      name: '1 receipt',
      price: 4.99,
      description: 'Perfect for trying out our generator.',
      features: ['1 professional receipt', 'All templates'],
      badge: 'Pay per use'
    },
    {
      id: '1-day',
      name: 'Day Pass',
      price: 8.99,
      description: '24 hours of unlimited access.',
      features: ['Unlimited receipts for 24 hours', 'All templates'],
    },
    {
      id: '1-week',
      name: 'Weekly',
      price: 15.99,
      description: 'Ideal for short-term projects.',
      features: ['7 days unlimited access', 'All templates', 'Priority support'],
      badge: 'Most Flexible'
    },
  ];

  const bottomRowPlans = [
    {
      id: '1-month',
      name: '1 month',
      price: 22.99,
      description: 'Best for regular business use.',
      popular: true,
      features: ['30 days unlimited access', 'All premium features', 'Dedicated support'],
    },
    {
      id: '6 months',
      name: '6 months',
      price: 44.99,
      description: 'Maximum value for power users.',
      features: ['6 months unlimited access', 'All enterprise features', '24/7 dedicated support'],
      badge: 'Best Value'
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      {/* Header / Banner */}
      <section className="mx-auto max-w-6xl px-6 pt-10">
        
        <div className="mb-8 text-center">
          
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Choose the plan that works for you. One-time payments, no autorenewals.
          </p>
        </div>
      </section>

      {/* Top Row - Starter, Day Pass, Weekly */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {topRowPlans.map((plan) => (
            <div
              key={plan.id}
              className="relative rounded-2xl border border-gray-200 bg-white"
            >
              {/* Plan Badge */}
              {plan.badge && (
                <div className="absolute -top-3 right-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-8">
                <h2 className="text-3xl font-semibold text-gray-900">{plan.name}</h2>
                <p className="mt-2 text-gray-600">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-light text-gray-900">${plan.price}</span>
                  <span className="text-sm font-medium text-gray-500">
                    {plan.id === '1-receipt' && '/ receipt'}
                    {plan.id === '1-day' && '/ day'}
                    {plan.id === '1-week' && '/ week'}
                  </span>
                </div>

                {plan.id !== '1-receipt' && (
                  <p className="mt-1 text-sm text-gray-500">One-time payment • No auto-renewal</p>
                )}

                <div  className="mt-6 ">
                  <a
                  style={{color:'white'}}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-lg bg-green-600 px-4 py-3 text-center font-medium text-white-100 hover:bg-gray-200"
                  >
                    Get {plan.name}
                  </a>
                </div>
              </div>

              <ul className="grid gap-4 border-t border-gray-200 p-8 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Row - Professional, Pro */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {bottomRowPlans.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative rounded-2xl border bg-white
                ${plan.popular 
                  ? 'border-yellow-400 shadow-sm lg:scale-[1.03]' 
                  : 'border-gray-200'
                }
              `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                  <span style={{color:'white'}} className=" bg-green-600  px-4 py-2">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Badge */}
              {plan.badge && !plan.popular && (
                <div className="absolute -top-3 right-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-8">
                <h2 className="text-3xl font-semibold text-gray-900">{plan.name}</h2>
                <p className="mt-2 text-gray-600">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-light text-gray-900">${plan.price}</span>
                  <span className="text-sm font-medium text-gray-500">
                    {plan.id === '1-month' && '/ month'}
                    {plan.id === '6-months' && '/ 6 months'}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">One-time payment • No auto-renewal</p>

                <div className="mt-6">
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-lg bg-green-600 px-4 py-3 text-center font-medium text-white hover:bg-green-700"
                  >
                    Get {plan.name}
                  </a>
                </div>
              </div>

              <ul className="grid gap-4 border-t border-gray-200 p-8 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

   

      <Footer />
    </div>
  );
}