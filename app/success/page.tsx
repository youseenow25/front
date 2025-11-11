"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/');
  };

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-card">
          {/* Success Icon */}
          <div className="success-icon-wrapper">
            <div className="icon-circle">
              <CheckCircle className="success-icon" />
            </div>
          </div>

          {/* Success Content */}
          <div className="success-content">
            <h1 className="success-title">Payment Successful</h1>
            <p className="success-message">
              Your payment has been processed successfully. You can now access all premium features.
            </p>
          </div>

          {/* Action Button */}
          <button 
            className="continue-button"
            onClick={handleGoToDashboard}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>

      <style jsx>{`
        .success-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .success-container {
          width: 100%;
          max-width: 400px;
        }

        .success-card {
          background: white;
          border-radius: 20px;
          padding: 48px 32px;
          text-align: center;
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.08),
            0 1px 3px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .success-icon-wrapper {
          margin-bottom: 24px;
        }

        .icon-circle {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #10b981, #34d399);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }

        .success-icon {
          width: 40px;
          height: 40px;
          color: white;
        }

        .success-content {
          margin-bottom: 32px;
        }

        .success-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .success-message {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.5;
          max-width: 320px;
          margin: 0 auto;
        }

        .continue-button {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          max-width: 240px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .continue-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        .continue-button:active {
          transform: translateY(0);
        }

        /* Subtle animation for the icon */
        @keyframes gentleBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .icon-circle {
          animation: gentleBounce 2s ease-in-out;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .success-card {
            padding: 40px 24px;
            margin: 0 16px;
          }

          .success-title {
            font-size: 24px;
          }

          .success-message {
            font-size: 15px;
          }

          .icon-circle {
            width: 70px;
            height: 70px;
          }

          .success-icon {
            width: 35px;
            height: 35px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;