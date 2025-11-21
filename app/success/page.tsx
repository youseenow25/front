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

    // 🔥 NEW: FIRE GOOGLE ADS CONVERSION
    const fireConversion = () => {
      if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-17728207333/wAlFCPWSzMAbEOXzu4VC', // ← Your Conversion ID + Label
          'value': 4.00, // ← Match the value in Google Ads
          'currency': 'EUR' // ← Match your currency
        });
        console.log("💰 Google Ads conversion fired!");
        return true;
      }
      return false;
    };

    // Try immediately, retry if gtag hasn't loaded yet
    if (!firePageView() || !fireConversion()) {
      const timer = setTimeout(() => {
        firePageView();
        fireConversion();
      }, 1000);
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
          <div style={{display:'flex', textAlign:'center', justifyContent:'center'}} className="success-icon-wrapper">
            <span style={{fontSize:30, fontWeight:'700'}} >
              Payment successful ✅
            </span>
           
          </div>

          {/* Content */}
          <div className="success-content">
            <h1 style={{fontSize:30}} className="success-title">
              ❗❗ Go back to dashboard and repeat the process to generate it.
            </h1>
            <p className="success-message">
              ❗❗ Go back and repeat the process to generate the receipts.
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
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .success-card {
          width: 1000px;
          max-width: 90%;
          background: white;
          border-radius: 20px;
          padding: 48px 40px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08),
            0 1px 3px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin: 0 auto;
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
          width: 100%;
        }

        .success-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 16px;
          line-height: 1.4;
          word-wrap: break-word;
          text-align: center;
        }

        .success-message {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.5;
          margin: 0 auto;
          word-wrap: break-word;
          text-align: center;
          max-width: 800px;
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
          width: auto;
          min-width: 240px;
          max-width: 300px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          margin: 0 auto;
          display: block;
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

        /* Tablet */
        @media (max-width: 1024px) {
          .success-card {
            width: 90%;
            max-width: 800px;
            padding: 40px 30px;
          }
          
          .success-title {
            font-size: 22px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .success-page {
            padding: 15px;
          }
          
          .success-card {
            width: 95%;
            max-width: 600px;
            padding: 32px 20px;
          }
          
          .success-title {
            font-size: 20px;
            margin-bottom: 12px;
          }
          
          .success-message {
            font-size: 14px;
          }
          
          .icon-circle {
            width: 70px;
            height: 70px;
          }
          
          .success-icon {
            width: 35px;
            height: 35px;
          }
          
          .continue-button {
            min-width: 200px;
            padding: 12px 24px;
            font-size: 15px;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .success-page {
            padding: 10px;
          }
          
          .success-card {
            width: 98%;
            max-width: 400px;
            padding: 24px 16px;
            border-radius: 16px;
          }
          
          .success-title {
            font-size: 18px;
          }
          
          .success-message {
            font-size: 13px;
          }
          
          .icon-circle {
            width: 60px;
            height: 60px;
          }
          
          .success-icon {
            width: 30px;
            height: 30px;
          }
          
          .continue-button {
            min-width: 180px;
            padding: 10px 20px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;