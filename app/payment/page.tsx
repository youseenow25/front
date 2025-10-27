// app/pricing/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

import Image from 'next/image';
import Footer from '@/components/Footer';

const PricingPage = () => {
  const router = useRouter();
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Simulate online users between 1200-1500
    setOnlineUsers(Math.floor(Math.random() * 300) + 1200);
  }, []);

  const handleDiscordClick = () => {
    window.open('https://discord.gg/hubreceipts', '_blank');
  };

  return (
    <div className="pricing-container">
      <Header />
      
      <div className="pricing-content">
        {/* Header */}
        <div className="header-section">
         
          
          <p>Join our discord to get HubReceipts with instant support and regular updates</p>
        </div>

        {/* Main Card */}
        <div className="main-card">
          <div className="card-header">
            <div className="server-info">
              <div className="server-avatar">
                <Image height={40} width={40} src={'/hublogo.png'} alt = "brandimag" >

                </Image>
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
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <strong>Instant Access</strong>
                  <span>Get started immediately</span>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🔧</div>
                <div className="feature-text">
                  <strong>Direct Support</strong>
                  <span>Help from admins & community</span>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🔄</div>
                <div className="feature-text">
                  <strong>Regular Updates</strong>
                  <span>New features constantly</span>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">💬</div>
                <div className="feature-text">
                  <strong>Active Community</strong>
                  <span>Connect with other users</span>
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
                  <span>Join Discord Server</span>
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
          <h3>How to Get Started</h3>
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
                <h4>Get Access</h4>
                <p>Message admin for purchase</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Start Creating</h4>
                <p>Generate receipts instantly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .pricing-container {
          min-height: 100vh;
          background: #f8fafc;
        }

        .pricing-content {
          max-width: 500px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .header-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #dcfce7;
          color: #166534;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 24px;
        }

        .online-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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
          display: flex;
          justify-content: between;
          align-items: start;
        }

        .server-info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .server-avatar {
          position: relative;
        }

        .avatar-image {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #5865f2, #4752c4);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
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

        .verified-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #e0e7ff;
          color: #3730a3;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
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

        @media (max-width: 640px) {
          .pricing-content {
            padding: 20px 16px;
          }

          .header-section h1 {
            font-size: 2rem;
          }

          .card-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .verified-badge {
            align-self: flex-start;
          }

          .steps-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default PricingPage;