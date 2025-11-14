"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

// Declare global gtag type for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const PaymentSuccess = () => {
  const router = useRouter();

  React.useEffect(() => {
    // 🔥 REQUIRED FOR URL DESTINATION CONVERSIONS IN NEXT.JS
    const firePageView = () => {
      if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
        window.gtag("event", "page_view", {
          page_path: "/success", // ← Must match your success URL
        });
        console.log("🔥 Page view fired for URL destination conversion");
        return true;
      }
      return false;
    };

    // Try immediately, retry if gtag hasn't loaded yet
    if (!firePageView()) {
      const timer = setTimeout(() => firePageView(), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleGoToDashboard = () => {
    router.push("/");
  };

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-card">
          {/* Icon */}
          <div className="success-icon-wrapper">
            <div className="icon-circle">
              <CheckCircle className="success-icon" />
            </div>
          </div>

          {/* Content */}
          <div className="success-content">
            <h1 className="success-title">Payment Successful</h1>
            <p className="success-message">
              Your payment has been processed successfully. You can now access
              all premium features.
            </p>
          </div>

          {/* Button */}
          <button className="continue-button" onClick={handleGoToDashboard}>
            Go to Receipt Generator
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            sans-serif;
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
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08),
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
          animation: gentleBounce 2s ease-in-out;
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

        @keyframes gentleBounce {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
