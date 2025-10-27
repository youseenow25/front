// app/pricing/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  popular?: boolean;
  bestValue?: boolean;
  savings?: string;
}

const PricingPage = () => {
  const router = useRouter();

  const plans: Plan[] = [
    {
      id: '1-receipt',
      name: 'Single Receipt',
      price: 4,
      originalPrice: 8,
      description: 'Perfect for one-time use',
      features: [
        'Generate 1 professional receipt',
        'All premium templates',
        'Instant download',
        'Money-back guarantee'
      ],
      savings: '50% OFF'
    },
    {
      id: '1-day',
      name: '24 Hours',
      price: 7,
      originalPrice: 15,
      description: 'Full access for 24 hours',
      features: [
        'Unlimited receipts for 1 day',
        'All premium templates',
        'Priority support',
        'Export multiple formats'
      ],
      savings: '53% OFF'
    },
    {
      id: '1-week',
      name: '1 Week',
      price: 11,
      originalPrice: 25,
      description: 'Our most popular plan',
      features: [
        'Unlimited receipts for 7 days',
        'All premium templates',
        'Priority support',
        'Custom branding'
      ],
      popular: true,
      savings: '56% OFF'
    },
    {
      id: '1-month',
      name: '1 Month',
      price: 19,
      originalPrice: 45,
      description: 'Best for regular users',
      features: [
        'Unlimited receipts for 30 days',
        'All premium templates',
        'Priority support',
        'Custom branding',
        'Advanced analytics'
      ],
      bestValue: true,
      savings: '58% OFF'
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: 35,
      originalPrice: 99,
      description: 'Never pay again',
      features: [
        'Lifetime unlimited receipts',
        'All current & future templates',
        'Priority support',
        'Custom branding',
        'Advanced analytics',
        'Early access to new features'
      ],
      savings: '65% OFF'
    }
  ];

  const handleGetStarted = (plan: Plan) => {
    sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
    router.push('/payment');
  };

  return (
    <div className="pricing-container">
      <Header/>
      
      {/* Header Section */}
      <div className="pricing-header">
        <div className="header-content">
          <h1>⚡ Create Professional Receipts in Seconds</h1>
          <p className="subtitle">Trusted by thousands of businesses worldwide</p>
          
          {/* Social Proof */}
          <div className="social-proof">
            <div className="rating">
              <div className="stars">★★★★★</div>
              <span>4.9/5 from 2,500+ reviews</span>
            </div>
            <div className="trust-badges">
              <div className="badge">✅ 30-Day Money Back</div>
              <div className="badge">🔒 Secure Payment</div>
              <div className="badge">⚡ Instant Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Limited Time Offer Banner */}
      <div className="offer-banner">
        <div className="offer-content">
          <span className="offer-tag">LIMITED TIME OFFER</span>
          <span className="offer-text">Get up to 65% OFF on all plans! Prices increase soon.</span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="plans-section">
        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? 'popular' : ''} ${plan.bestValue ? 'best-value' : ''}`}
            >
              {/* Badges */}
              {plan.bestValue && (
                <div className="best-value-badge">
                  <span>🔥 BEST VALUE</span>
                </div>
              )}
              {plan.popular && !plan.bestValue && (
                <div className="popular-badge">
                  <span>⭐ MOST POPULAR</span>
                </div>
              )}

              {/* Savings Badge */}
              {plan.savings && (
                <div className="savings-badge">
                  {plan.savings}
                </div>
              )}

              {/* Plan Header */}
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="plan-pricing">
                {plan.originalPrice && (
                  <div className="original-price">
                    ${plan.originalPrice} USD
                  </div>
                )}
                <div className="price-main">
                  <span className="price-currency">$</span>
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-period">USD</span>
                </div>
                
                {plan.id !== '1-receipt' && plan.id !== 'lifetime' && (
                  <div className="billed-text">one time payment</div>
                )}
                {(plan.id === '1-receipt' || plan.id === 'lifetime') && (
                  <div className="billed-text">one time payment</div>
                )}
              </div>

              {/* Features */}
              <div className="plan-features">
                {plan.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                className="plan-button"
                onClick={() => handleGetStarted(plan)}
              >
                <span className="button-text">
                  Get Started Now ⚡
                </span>
                <span className="button-subtext">Instant Access · No Setup Fees</span>
              </button>

              {/* Guarantee */}
              <div className="guarantee">
                <span>✅ 30-day money-back guarantee</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Can I cancel my subscription?</h3>
            <p>All our plans are one-time payments with no subscriptions. You pay once and get access for the duration you selected.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a money-back guarantee?</h3>
            <p>Yes! We offer a 30-day money-back guarantee on all plans. If you're not satisfied, we'll refund your payment.</p>
          </div>
          <div className="faq-item">
            <h3>How do I access my receipts?</h3>
            <p>You can access and download your receipts instantly after generation. All receipts are stored in your account dashboard.</p>
          </div>
          <div className="faq-item">
            <h3>Can I upgrade my plan later?</h3>
            <p>Absolutely! You can upgrade to a higher plan at any time, and we'll apply your previous payment as credit.</p>
          </div>
        </div>
      </div>

      <Footer/>

      <style jsx>{`
        .pricing-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .pricing-header {
          text-align: center;
          padding: 80px 20px 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .header-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .header-content h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 1.5rem;
          color: #e2e8f0;
          margin: 0 0 40px 0;
          font-weight: 300;
        }

        .social-proof {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.1rem;
        }

        .stars {
          color: #ffd700;
          font-size: 1.4rem;
        }

        .trust-badges {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          backdrop-filter: blur(10px);
        }

        .offer-banner {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
          padding: 16px;
          text-align: center;
        }

        .offer-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .offer-tag {
          background: white;
          color: #ee5a24;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.8rem;
        }

        .offer-text {
          font-weight: 600;
          font-size: 1rem;
        }

        .plans-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          align-items: start;
        }

        .plan-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 20px;
          padding: 32px;
          position: relative;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          height: fit-content;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .plan-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border-color: #6366f1;
        }

        .plan-card.popular {
          border-color: #6366f1;
          background: linear-gradient(135deg, #fff 0%, #f8faff 100%);
        }

        .plan-card.best-value {
          border-color: #6366f1;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          transform: scale(1.05);
        }

        .plan-card.best-value:hover {
          transform: scale(1.05) translateY(-8px);
        }

        .best-value-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%);
          color: white;
          padding: 8px 24px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #6366f1;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .savings-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .plan-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .plan-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .plan-card.best-value .plan-name {
          color: white;
        }

        .plan-description {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        .plan-card.best-value .plan-description {
          color: #e2e8f0;
        }

        .plan-pricing {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #f1f5f9;
        }

        .plan-card.best-value .plan-pricing {
          border-bottom-color: rgba(255, 255, 255, 0.2);
        }

        .original-price {
          font-size: 1rem;
          color: #94a3b8;
          text-decoration: line-through;
          margin-bottom: 8px;
        }

        .plan-card.best-value .original-price {
          color: rgba(255, 255, 255, 0.7);
        }

        .price-main {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
          margin-bottom: 8px;
        }

        .price-currency {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .plan-card.best-value .price-currency {
          color: white;
        }

        .price-amount {
          font-size: 3.5rem;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1;
        }

        .plan-card.best-value .price-amount {
          color: white;
        }

        .price-period {
          font-size: 1.1rem;
          color: #666;
          font-weight: 500;
        }

        .plan-card.best-value .price-period {
          color: #e2e8f0;
        }

        .billed-text {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }

        .plan-card.best-value .billed-text {
          color: #e2e8f0;
        }

        .plan-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
          flex: 1;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .feature-icon {
          width: 18px;
          height: 18px;
          color: #10b981;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .plan-card.best-value .feature-icon {
          color: #10b981;
        }

        .feature-text {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.5;
        }

        .plan-card.best-value .feature-text {
          color: #e2e8f0;
        }

        .plan-button {
          width: 100%;
          padding: 16px;
          border: none;
          background: linear-gradient(135deg, #0a77fe 0%, #0066e0 100%);
          color: white;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .plan-card.best-value .plan-button {
          background: linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%);
          color: #1a1a1a;
        }

        .plan-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(10, 119, 254, 0.4);
        }

        .plan-card.best-value .plan-button:hover {
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
        }

        .button-text {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .button-subtext {
          font-size: 0.8rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .guarantee {
          text-align: center;
          font-size: 0.8rem;
          color: #666;
        }

        .plan-card.best-value .guarantee {
          color: #e2e8f0;
        }

        .faq-section {
          max-width: 1000px;
          margin: 0 auto 80px;
          padding: 0 20px;
          text-align: center;
        }

        .faq-section h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 40px 0;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 32px;
          text-align: left;
        }

        .faq-item {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .faq-item h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 12px 0;
        }

        .faq-item p {
          font-size: 1rem;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 768px) {
          .header-content h1 {
            font-size: 2.5rem;
          }

          .subtitle {
            font-size: 1.2rem;
          }

          .trust-badges {
            flex-direction: column;
            gap: 10px;
          }

          .plans-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .plan-card.best-value {
            transform: none;
          }

          .plan-card.best-value:hover {
            transform: translateY(-8px);
          }

          .faq-grid {
            grid-template-columns: 1fr;
          }

          .offer-content {
            flex-direction: column;
            gap: 8px;
          }
        }

        @media (max-width: 480px) {
          .faq-grid {
            grid-template-columns: 1fr;
          }
          
          .plan-card {
            padding: 24px;
          }
          
          .price-amount {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PricingPage;