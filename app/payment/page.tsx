'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Image from 'next/image';
import Footer from '@/components/Footer';

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
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'pricing'>('preview');

  useEffect(() => {
    // Get the stored receipt data from localStorage
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
      // No receipt data found, redirect to home
      router.push('/');
    }
  }, [router]);

  const handleDiscordClick = () => {
    window.open('https://discord.gg/hubreceipts', '_blank');
  };

  const handleCreateNewReceipt = () => {
    // Clear the stored data and redirect to home
    localStorage.removeItem('pendingReceipt');
    router.push('/');
  };

  if (!paymentData) {
    return (
      <div className="loading-container">
        <Header />
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading your receipt preview...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="payment-container">
      <Header />
      
      <div className="payment-content">
        {/* Header */}
        <div className="header-section">
          <h1>Upgrade to Remove Watermark</h1>
          <p>Your receipt has been generated with a preview watermark. Subscribe to remove it and get email delivery.</p>
        </div>

        {/* Tabs */}
        <div className="tabs-section">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              📄 Receipt Preview
            </button>
            <button 
              className={`tab ${activeTab === 'pricing' ? 'active' : ''}`}
              onClick={() => setActiveTab('pricing')}
            >
              💰 Pricing & Plans
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'preview' ? (
          <div className="preview-section">
            <div className="preview-container">
              <div className="preview-header">
                <h3>Your Receipt Preview</h3>
                <p className="watermark-notice">
                  ⚠️ This is a preview version with watermark. Subscribe to remove it.
                </p>
              </div>
              
              <div className="receipt-preview">
                {/* ONLY SHOW THE WATERMARKED RECEIPT HTML */}
                <div 
                  dangerouslySetInnerHTML={{ __html: paymentData.generatedHtml }}
                />
              </div>

              <div className="preview-actions">
                <button className="secondary-btn" onClick={handleCreateNewReceipt}>
                  Create New Receipt
                </button>
                <button 
                  className="primary-btn"
                  onClick={() => setActiveTab('pricing')}
                >
                  Remove Watermark & Subscribe
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="pricing-section">
            {/* Main Card */}
            <div className="main-card">
              <div className="card-header">
                <div className="server-info">
                  <div className="server-avatar">
                    <Image height={40} width={40} src={'/hublogo.png'} alt="brandimage" />
                    <div className="online-status"></div>
                  </div>
                  <div className="server-details">
                    <h2>HubReceipts</h2>
                    <div className="member-count">
                      <span className="count">40</span>
                      <span className="label">Members Online</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="features-grid">
                  <div className="feature">
                    <div className="feature-icon">🚫</div>
                    <div className="feature-text">
                      <strong>Remove Watermark</strong>
                      <span>Clean, professional receipts</span>
                    </div>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">📧</div>
                    <div className="feature-text">
                      <strong>Email Delivery</strong>
                      <span>Direct to your inbox</span>
                    </div>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">⚡</div>
                    <div className="feature-text">
                      <strong>Unlimited Generations</strong>
                      <span>No daily limits</span>
                    </div>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">💬</div>
                    <div className="feature-text">
                      <strong>Priority Support</strong>
                      <span>Fast help when needed</span>
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="action-section">
                  <button 
                    className={`join-button ${isHovered ? 'hovered' : ''}`}
                    onClick={handleDiscordClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div className="button-content">
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.25c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
                      </svg>
                      <span>Join Discord to Subscribe</span>
                    </div>
                    <div className="button-hover-effect"></div>
                  </button>
                  
                  <p className="join-text">
                    Join <strong>94+ members</strong> already using HubReceipts
                  </p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="steps-section">
              <h3>How to Subscribe</h3>
              <div className="steps-grid">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Join Server</h4>
                    <p>Click the join button above</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Message Admin</h4>
                    <p>Request subscription access</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Get Access</h4>
                    <p>Start creating unlimited receipts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />

      <style jsx>{`
        .payment-container {
          min-height: 100vh;
          background: #f8fafc;
        }

        .loading-container {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
        }

        .loading-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #5865f2;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .payment-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .header-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .header-section h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .header-section p {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .tabs-section {
          margin-bottom: 32px;
        }

        .tabs {
          display: flex;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 4px;
          max-width: 400px;
          margin: 0 auto;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab.active {
          background: #5865f2;
          color: white;
        }

        .preview-section {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        .preview-container {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .preview-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .preview-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .watermark-notice {
          color: #dc2626;
          font-weight: 500;
          background: #fef2f2;
          padding: 8px 16px;
          border-radius: 8px;
          display: inline-block;
        }

        .receipt-preview {
          border: 2px dashed #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          background: #fafafa;
          margin-bottom: 24px;
          max-height: 600px;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        /* Remove any additional styling from the HTML preview */
        .receipt-preview > div {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .preview-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .primary-btn {
          background: #5865f2;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .primary-btn:hover {
          background: #4752c4;
        }

        .secondary-btn {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .secondary-btn:hover {
          background: #e5e7eb;
        }

        .pricing-section {
          max-width: 500px;
          margin: 0 auto;
        }

        .main-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-bottom: 40px;
        }

        .card-header {
          padding: 24px;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
        }

        .server-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .server-avatar {
          position: relative;
        }

        .online-status {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 16px;
          height: 16px;
          background: #22c55e;
          border: 3px solid white;
          border-radius: 50%;
        }

        .server-details h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 4px 0;
        }

        .member-count {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .count {
          font-weight: 500;
          color: #1a1a1a;
        }

        .label {
          color: #666;
          font-size: 0.9rem;
        }

        .card-body {
          padding: 32px 24px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: #f8fafc;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .feature-text {
          display: flex;
          flex-direction: column;
        }

        .feature-text strong {
          color: #1a1a1a;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .feature-text span {
          color: #666;
          font-size: 0.9rem;
        }

        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 24px 0;
        }

        .action-section {
          text-align: center;
        }

        .join-button {
          position: relative;
          width: 100%;
          background: #5865f2;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 16px 24px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .join-button:hover {
          background: #4752c4;
          transform: translateY(-1px);
        }

        .join-button.hovered {
          transform: translateY(-1px);
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          position: relative;
          z-index: 2;
        }

        .button-hover-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .join-button:hover .button-hover-effect {
          left: 100%;
        }

        .join-text {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
        }

        .join-text strong {
          color: #1a1a1a;
        }

        .steps-section {
          text-align: center;
        }

        .steps-section h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 32px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .step {
          text-align: center;
        }

        .step-number {
          width: 40px;
          height: 40px;
          background: #5865f2;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin: 0 auto 12px;
        }

        .step-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .step-content p {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
        }

        @media (max-width: 768px) {
          .payment-content {
            padding: 20px 16px;
          }

          .header-section h1 {
            font-size: 2rem;
          }

          .preview-section {
            grid-template-columns: 1fr;
          }

          .preview-container {
            padding: 24px;
          }

          .preview-actions {
            flex-direction: column;
          }

          .steps-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .tabs {
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .receipt-preview {
            padding: 10px;
          }
          
          .receipt-preview > div {
            transform: scale(0.9);
            transform-origin: top center;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;