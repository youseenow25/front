'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Declare PayPal types
declare global {
  interface Window {
    paypal: any;
  }
}

interface PaymentData {
  generatedHtml: string;
  formData: {
    brand: string;
    email: string;
    language: string;
    currency: string;
    otherFields: Record<string, string>;
  };
  timestamp: string;
}

const PaymentPage = () => {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const paypalButtonsRendered = useRef(false);

  useEffect(() => {
    const storedData = localStorage.getItem('pendingReceipt');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setPaymentData(data);
      } catch (error) {
        console.error('Error parsing payment data:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  // Load and initialize PayPal SDK with CORRECT configuration
  useEffect(() => {
    // Remove any existing PayPal scripts to avoid conflicts
    const existingScripts = document.querySelectorAll('script[src*="paypal.com/sdk/js"]');
    existingScripts.forEach(script => script.remove());

    // Load PayPal SDK with BUTTONS component (not hosted-buttons)
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=BAApuZbatSxY7Lu9aDX_G_AQkQT-5CLQut8xKkfth-Izi3x8UxpzopkkstY3ZwoLEo0Xy-sgxzk4PfJ5d0&components=hosted-buttons&disable-funding=venmo&currency=EUR';
    script.crossOrigin = 'anonymous';
    script.async = true;
    
    script.onload = () => {
      console.log('PayPal SDK loaded successfully with buttons component');
      setPaypalLoaded(true);
      setPaypalError(null);
    };

    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      setPaypalError('Failed to load PayPal. Please refresh the page.');
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = '';
      }
      paypalButtonsRendered.current = false;
    };
  }, []);

  // Re-initialize when PayPal loads and payment data is available
  useEffect(() => {
    if (paypalLoaded && paymentData && window.paypal) {
      // Small delay to ensure PayPal is fully initialized
      setTimeout(() => {
        initializePayPalButtons();
      }, 100);
    }
  }, [paypalLoaded, paymentData]);

  const initializePayPalButtons = () => {
    if (!window.paypal || !paymentData || paypalButtonsRendered.current) {
      return;
    }

    const container = document.getElementById('paypal-button-container');
    if (!container) {
      console.error('PayPal container not found');
      return;
    }

    // Clear previous buttons
    container.innerHTML = '';

    try {
      console.log('Initializing PayPal buttons...');
      console.log('PayPal object available:', !!window.paypal);
      console.log('Buttons function available:', !!window.paypal.Buttons);
      
      if (!window.paypal.Buttons) {
        throw new Error('PayPal Buttons function is not available. Check SDK components.');
      }

      window.paypal.Buttons({
        style: { 
          color: 'gold', 
          layout: 'vertical',
          height: 48,
          tagline: false,
          shape: 'rect',
          label: 'paypal'
        },
        
        createOrder: function(data: any, actions: any) {
          console.log('Creating PayPal order with EUR currency...');
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: '5.00',
                  currency_code: 'EUR'
                },
                description: 'Payment for services'
              }
            ],
            application_context: {
              shipping_preference: 'NO_SHIPPING',
              user_action: 'PAY_NOW'
            }
          });
        },
        
        onApprove: async function(data: any, actions: any) {
          try {
            console.log('Payment approved, capturing order...', data);
            const details = await actions.order.capture();
            console.log('Transaction completed:', details);
            
            // Handle successful payment
            alert(`Payment successful! Thank you for your payment of €5.00.`);
            
          } catch (error) {
            console.error('Payment capture error:', error);
            alert('There was an error processing your payment. Please try again.');
          }
        },
        
        onError: function(err: any) {
          console.error('PayPal Button Error:', err);
          let errorMessage = 'An error occurred with PayPal. Please try again.';
          
          setPaypalError(errorMessage);
        },
        
        onCancel: function(data: any) {
          console.log('Payment cancelled by user');
        }
        
      }).render('#paypal-button-container').then(() => {
        console.log('PayPal buttons rendered successfully');
        paypalButtonsRendered.current = true;
      }).catch((error: any) => {
        console.error('Error rendering PayPal buttons:', error);
        setPaypalError('Failed to load PayPal button. Please refresh the page.');
      });
      
    } catch (error) {
      console.error('Error initializing PayPal buttons:', error);
      setPaypalError('Failed to initialize PayPal. Please check the browser console for details.');
    }
  };

  if (!paymentData) {
    return (
      <div className="loading-container">
        <Header />
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading checkout...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header />

      <div className="checkout-content">
        {/* LEFT: Receipt Preview */}
        <div className="receipt-section">
          <div
            className="receipt-html"
            dangerouslySetInnerHTML={{ __html: paymentData.generatedHtml }}
          />
        </div>

        {/* RIGHT: PayPal Checkout */}
        <div className="checkout-section">
          <div className="checkout-card">
            <h2>Complete Your Payment</h2>
            <p className="payment-description">Secure payment via PayPal - €5.00</p>
            
            {/* Show loading state while PayPal initializes */}
            {!paypalLoaded && !paypalError && (
              <div className="paypal-loading">
                <div className="loading-spinner-small"></div>
                <p>Loading PayPal...</p>
              </div>
            )}
            
            {/* Show error message if any */}
            {paypalError && (
              <div className="error-message">
                <strong>PayPal Error:</strong>
                <br />
                {paypalError}
                <br />
                <div style={{ marginTop: '10px' }}>
                  <button 
                    className="retry-btn"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                  <button 
                    className="alternative-btn"
                    onClick={() => {
                      // Remove current script and reload with correct components
                      const scripts = document.querySelectorAll('script[src*="paypal.com/sdk/js"]');
                      scripts.forEach(script => script.remove());
                      setPaypalLoaded(false);
                      setPaypalError(null);
                      paypalButtonsRendered.current = false;
                      
                      // Reload script with correct configuration
                      const script = document.createElement('script');
                      script.src = 'https://www.paypal.com/sdk/js?client-id=BAApuZbatSxY7Lu9aDX_G_AQkQT-5CLQut8xKkfth-Izi3x8UxpzopkkstY3ZwoLEo0Xy-sgxzk4PfJ5d0&components=buttons&currency=EUR';
                      script.crossOrigin = 'anonymous';
                      script.async = true;
                      script.onload = () => {
                        setPaypalLoaded(true);
                        setPaypalError(null);
                      };
                      document.body.appendChild(script);
                    }}
                    style={{ marginLeft: '10px' }}
                  >
                    Reload SDK
                  </button>
                </div>
              </div>
            )}
            
            {/* PayPal Button Container */}
            <div className="paypal-button-container" id="paypal-button-container"></div>
            
            <div className="secure-note">
              🔒 Your payment is secure and encrypted
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .checkout-content {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: 40px;
          padding: 60px 40px;
          flex: 1;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .receipt-section {
          flex: 1;
          border-radius: 12px;
          padding: 25px;
          max-width: 600px;
          overflow-y: auto;
          max-height: 80vh;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          background: white;
        }

        .receipt-html {
          font-size: 0.95rem;
          line-height: 1.5;
          color: #333;
        }

        .checkout-section {
          flex: 0.6;
          max-width: 450px;
        }

        .checkout-card {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 40px;
          background: white;
          position: sticky;
          top: 20px;
          text-align: center;
        }

        .checkout-card h2 {
          margin-bottom: 10px;
          color: #333;
          font-size: 1.5rem;
        }

        .payment-description {
          color: #666;
          margin-bottom: 30px;
          font-size: 0.95rem;
        }

        .paypal-button-container {
          width: 100%;
          margin: 20px 0;
          min-height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .paypal-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin: 20px 0;
        }

        .loading-spinner-small {
          width: 30px;
          height: 30px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #0070ba;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }

        .retry-btn, .alternative-btn {
          background: #dc2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 10px;
          font-size: 0.8rem;
        }

        .alternative-btn {
          background: #6b7280;
        }

        .retry-btn:hover {
          background: #b91c1c;
        }

        .alternative-btn:hover {
          background: #4b5563;
        }

        .secure-note {
          font-size: 0.8rem;
          color: #666;
          margin-top: 20px;
        }

        .spinner {
          width: 45px;
          height: 45px;
          border: 5px solid #ddd;
          border-top: 5px solid #4f46e5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #fff;
        }

        @media (max-width: 768px) {
          .checkout-content {
            flex-direction: column;
            padding: 20px;
          }
          
          .receipt-section,
          .checkout-section {
            max-width: 100%;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;