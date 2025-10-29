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
  description: string;
  features: string[];
  popular?: boolean;
  bestValue?: boolean;
}

const PricingPage = () => {
  const router = useRouter();

  const plans: Plan[] = [
    {
      id: '1-receipt',
      name: '1 Receipt',
      price: 4.99,
      description: 'Perfect for one-time use',
      features: [
        'Generate 1 professional receipt',
        'All premium templates',

    
     
      ]
    },
    {
      id: '1-day',
      name: '1 Day Access',
      price: 7.99,
      description: 'Full access for 24 hours',
      features: [
        'Unlimited receipts for 1 day',
        'All premium templates',

      
      ]
    },
    {
      id: '1-week',
      name: '1 Week Access',
      price: 14.99,
      description: 'Our most popular plan',
      features: [
        'Unlimited receipts for 7 days',
        'All premium templates',
      
       
      ],

    },
    {
      id: '1-month',
      name: '1 Month Access',
      price: 22.99,
      description: 'Best for regular users',
      features: [
        'Unlimited receipts for 30 days',
        'All premium templates',
        'Priority support',
        
      ],
      popular: true
    },
    {
      id: 'lifetime',
      name: 'Lifetime Access',
      price: 39.99,
      description: 'Never pay again',
      features: [
        'Lifetime unlimited receipts',
        'All current & future templates',
        'Priority support',
       
      ]
    }
  ];

  const handleGetStarted = (plan: Plan) => {
    // Store selected plan in session storage or context
    sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
    router.push('/payment');
  };

  return (
    <div className="pricing-container">
      <Header/>
      
      {/* Header Section */}
      <div className="pricing-header">
        <div className="header-content">
          <span style={{fontSize:30, fontWeight:'600'}} >⚡ Best quality receipts, if not, we'll give back the money</span>
          <p>No hidden fees. No contracts. Cancel anytime.</p>
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
                <div className="best-value-badge">BEST VALUE</div>
              )}
              {plan.popular && !plan.bestValue && (
                <div className="popular-badge">MOST POPULAR</div>
              )}

              {/* Plan Header */}
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="plan-pricing">
                <div className="price-main">
                  <span className="price-currency">$</span>
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-period">
                    {plan.id === '1-receipt' ? ' one time' : plan.id === 'lifetime' ? ' one time' : ''}
                  </span>
                </div>
                
                {plan.id !== '1-receipt' && plan.id !== 'lifetime' && (
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
                <span style={{fontSize:20, fontWeight:'bold'}} >

                     Buy now ⚡

                </span>

              </button>
            </div>
          ))}
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
          margin-top: 60px;
        }

        .header-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .header-content h1 {
          font-size: 30px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, #000 0%, #333 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-content p {
          font-size: 20px;
          color: #666;
          margin: 0 0 40px 0;
        }

        .plans-section {
          max-width: 1200px;
          margin: 0 auto 80px;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 1200px) {
          .plans-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .plans-grid {
            grid-template-columns: repeat(1, 1fr);
          }
        }

        .plan-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px;
          position: relative;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          height: fit-content;
        }

        .plan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .plan-card.popular {
          border-color: #6366f1;
          background: linear-gradient(135deg, #fff 0%, #f8faff 100%);
        }

        .plan-card.best-value {
          border-color: #000;
          background: linear-gradient(135deg, #000 0%, #333 100%);
          color: white;
          transform: scale(1.05);
        }

        .plan-card.best-value:hover {
          transform: scale(1.05) translateY(-4px);
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
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .plan-card.best-value .best-value-badge {
          background: #10b981;
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #6366f1;
          color: white;
          padding: 6px 20px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .plan-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .plan-name {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .plan-card.best-value .plan-name {
          color: white;
        }

        .plan-description {
          font-size: 14px;
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
          border-bottom-color: #334155;
        }

        .price-main {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
          margin-bottom: 8px;
        }

        .price-currency {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .plan-card.best-value .price-currency {
          color: white;
        }

        .price-amount {
          font-size: 48px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
        }

        .plan-card.best-value .price-amount {
          color: white;
        }

        .price-period {
          font-size: 18px;
          color: #666;
          font-weight: 500;
        }

        .plan-card.best-value .price-period {
          color: #e2e8f0;
        }

        .billed-text {
          font-size: 14px;
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
          width: 20px;
          height: 20px;
          color: #10b981;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .plan-card.best-value .feature-icon {
          color: #10b981;
        }

        .feature-text {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        .plan-card.best-value .feature-text {
          color: #e2e8f0;
        }

        .plan-button {
          width: 100%;
          padding: 10px;
          border: 2px solid #0a77fe;
          background: #0a77fe;
          color: white;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .plan-button:hover {
          background: #0066e0;
          border-color: #0066e0;
          transform: translateY(-1px);
        }

        .faq-section {
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }

        .faq-section h2 {
          font-size: 36px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 40px 0;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 32px;
          text-align: left;
        }

        .faq-item h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 12px 0;
        }

        .faq-item p {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 768px) {
          .pricing-container {
            padding: 20px 16px;
          }

          .header-content h1 {
            font-size: 36px;
          }

          .header-content p {
            font-size: 18px;
          }

          .plans-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .plan-card.best-value {
            transform: none;
          }

          .plan-card.best-value:hover {
            transform: translateY(-4px);
          }

          .faq-grid {
            grid-template-columns: 1fr;
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
            font-size: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default PricingPage;