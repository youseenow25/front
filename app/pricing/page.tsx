// app/pricing/page.tsx
'use client';

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
}

const PricingPage = () => {
  const router = useRouter();

  const plans: Plan[] = [
    {
      id: '1-receipt',
      name: '1 Receipt',
      price: 4.99,
      description: 'Perfect for one-time use',
      features: ['Generate 1 professional receipt', 'All premium templates'],
    },
    {
      id: '1-day',
      name: '1 Day Access',
      price: 7.99,
      description: 'Full access for 24 hours',
      features: ['Unlimited receipts for 1 day', 'All premium templates'],
    },
    {
      id: '1-week',
      name: '1 Week Access',
      price: 14.99,
      description: 'Our most popular plan',
      features: ['Unlimited receipts for 7 days', 'All premium templates'],
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
      popular: true,
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
      ],
    },
  ];

  return (
    <div className="pricing-page">
      <Header />
      <section className="pricing-header">
        <h1>Choose your plan</h1>
        <p>No hidden fees. Cancel anytime.</p>
      </section>

      <section className="pricing-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${plan.popular ? 'popular' : ''}`}
          >
            {plan.popular && <div className="badge">Popular</div>}
            <h2 className="plan-name">{plan.name}</h2>
            <p className="plan-description">{plan.description}</p>

            <div className="price-section">
              <span className="currency">$</span>
              <span className="price">{plan.price}</span>
              {(plan.id === '1-receipt' || plan.id === 'lifetime') && (
                <span className="period"> one time</span>
              )}
            </div>

            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="check-icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() =>
                window.open('https://discord.gg/2ZRQu2uT62', '_blank')
              }
              className={`cta-button ${plan.popular ? 'cta-popular' : ''}`}
            >
              Buy now ⚡
            </button>
          </div>
        ))}
      </section>

      <Footer />

      <style jsx>{`
        .pricing-page {
          background-color: #fafafa;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .pricing-header {
          text-align: center;
          padding: 60px 20px 40px;
        }

        .pricing-header h1 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .pricing-header p {
          font-size: 18px;
          color: #666;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
          max-width: 1000px;
          margin: 0 auto 80px;
          padding: 0 20px;
        }

        .plan-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 32px;
          text-align: left;
          position: relative;
          transition: all 0.25s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .plan-card:hover {
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          transform: translateY(-4px);
        }

        .plan-card.popular {
          border-color: #2563eb;
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
          transform: scale(1.03);
          z-index: 1;
        }

        .badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 14px;
          border-radius: 9999px;
        }

        .plan-name {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .plan-description {
          font-size: 15px;
          color: #666;
          margin-bottom: 24px;
        }

        .price-section {
          font-weight: 700;
          margin-bottom: 24px;
        }

        .currency {
          font-size: 20px;
          color: #111;
          vertical-align: super;
        }

        .price {
          font-size: 42px;
          color: #111;
        }

        .period {
          font-size: 16px;
          color: #666;
          font-weight: 500;
        }

        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 24px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .features li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          color: #444;
        }

        .check-icon {
          width: 18px;
          height: 18px;
          color: #10b981;
          flex-shrink: 0;
        }

        .cta-button {
          width: 100%;
          background: white;
          border: 1px solid #2563eb;
          color: #2563eb;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          padding: 12px 0;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .cta-button:hover {
          background: #2563eb;
          color: white;
        }

        .cta-popular {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .cta-popular:hover {
          background: #1e40af;
        }

        @media (max-width: 768px) {
          .pricing-header h1 {
            font-size: 28px;
          }
          .price {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
};

export default PricingPage;
