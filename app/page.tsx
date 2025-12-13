// app/page.tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import Link from 'next/link';
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next"
import StructuredData from "@/components/StructuredData";

// Force dynamic rendering to prevent build timeout
export const dynamic = 'force-dynamic'
export const dynamicParams = true

const brands = [
  "apple", "gucci", "stockx", "nike", "flightclub", "louisvuitton", "saintlaurent","trapstar"
]

function toLabel(name: string): string {
  const special: Record<string, string> = {
    zip_code: "ZIP Code",
    product_id: "Product ID",
    order_number: "Order Number",
    phone_number: "Phone Number",
    brand_name: "Brand Name",
    taxes_percentatge: "Taxes Percentage",
    card_end: "Card Ending",
    seller_name: "Seller Name",
    spain: "Country",
  };
  if (special[name]) return special[name];
  return name
    .split("_")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default function Page() {
  return (
    <>
      <main className="main">
        <div className="luxury-radial" aria-hidden />
        <Header />
        <section className="container" style={{ padding: '24px 20px 0 20px', textAlign: 'center' }}>
          <h1 className="seo-h1">
            Generate 1:1 Receipts for StockX, Farfetch +70 brands
          </h1>
          <p style={{ maxWidth: 760, margin: '0 auto', color: '#444', fontSize: '1rem', lineHeight: 1.6 }}>
            Generate email, paper and A4 receipts for more than 70 luxury brands.
          </p>
        </section>

        {/* Receipts Examples Section */}
        <section className="receipts-examples">
          <div className="container">
           
            
            <div className="receipts-grid">
              {brands.map((brand, index) => (
                <Link
                  key={brand}
                  href={`/brands/${brand}`}
                  className="receipt-card"
                  aria-label={`View the ${toLabel(brand)} receipt generator`}
                >
                  <div className="receipt-image">
                    <Image
                      src={`/${brand}_example.png`}
                      alt={`${toLabel(brand)} receipt example`}
                      width={120}
                      height={160}
                      loading={index < 4 ? "eager" : "lazy"}
                      priority={index < 2}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div style={{height:1, width:'150%', background:'linear-gradient(90deg, transparent, #d4af37, #c9b037, transparent)'}} />
        <div style={{width:'100%'}} >
          <Hero />
          <ImageUploader />
        </div>

        <section className="luxury-features">
          <div className="container">
            <h2 className="features-title">Check our videos of examples</h2>
           <div
  style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  }}
>
  <div className="video-container">
    <iframe
      width="560"
      height="405"
      src="https://www.youtube.com/embed/lSIbSG7K5MM?si=_T6UfwB3XPKVFNhA"
      title="YouTube video player"
      frameBorder="0"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  </div>

  <div className="video-container">
    <iframe
      width="560"
      height="405"
      src="https://www.youtube.com/embed/afOwQ4U1Z9Y?si=59fr5TSkEIQvqe5_"
      title="YouTube video player"
      frameBorder="0"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  </div>

  <div className="video-container">
    <iframe
      width="560"
      height="405"
      src="https://www.youtube.com/embed/w50nDYGEiqw?si=TbSN2YuJnzurLZMD"
      title="YouTube video player"
      frameBorder="0"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  </div>
</div>




          </div>
        </section>

        <section className="luxury-features">
          <div className="container">
            <h2 className="features-title">Why Choose HubReceipts?</h2>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3>Authentic Designs</h3>
                <p>StockX, Apple, Canada Goose +70 luxury brand receipts.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Instant Generation</h3>
                <p>Create professional luxury receipts in seconds with our advanced template system.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Secure & Private</h3>
                <p>Your financial data remains confidential with our secure processing system.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💼</div>
                <h3>Business Ready</h3>
                <p>Perfect for luxury resellers, investors, and business documentation.</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 20;
        }

        html, body {
          height: 100%;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
          background: #fefefe;
          color: #1a1a1a;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        .main {
          position: relative;
          overflow: hidden;
        }

        .luxury-radial {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 600px 400px at 20% 100px, rgba(212, 175, 55, 0.1), transparent 70%),
            radial-gradient(ellipse 800px 500px at 80% 300px, rgba(201, 176, 55, 0.08), transparent 70%),
            radial-gradient(ellipse 1000px 600px at center, rgba(0, 0, 0, 0.03), transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Receipts Examples Section */
        .receipts-examples {
          padding: 40px 0 30px 0;
          background: transparent;
          position: relative;
        }

        .examples-title {
          text-align: center;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #d4af37, #c9b037);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .examples-subtitle {
          text-align: center;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 30px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .receipts-grid {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
          max-width: 900px;
          margin: 0 auto;
          min-height: 160px;
        }

        .receipt-card {
          background: transparent;
          padding: 0;
          border-radius: 0;
          text-align: center;
          transition: all 0.2s ease;
          border: none;
          flex-shrink: 0;
        }

        .receipt-card:hover {
          transform: translateY(-2px);
        }

        .receipt-image {
          margin: 0;
          border-radius: 2px;
          overflow: hidden;
          background: transparent;
          padding: 0;
          display: block;
          width: 120px;
          height: 160px;
          aspect-ratio: 3 / 4;
          position: relative;
        }
        
        .receipt-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* Luxury Brands Section */
        .luxury-brands {
          padding: 80px 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          position: relative;
        }

        .brands-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #d4af37, #c9b037);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brands-subtitle {
          text-align: center;
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 60px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .brands-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }

        .brand-card {
          background: white;
          padding: 40px 30px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .brand-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #d4af37, #c9b037);
        }

        .brand-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 40px rgba(212, 175, 55, 0.15);
        }

        .brand-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .brand-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .brand-card p {
          color: #666;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        /* Features Section */
        .luxury-features {
          padding: 10px 0;
          background: white;
        }

        .features-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #1a1a1a, #333);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }

        .feature-card {
          background: #fafafa;
          padding: 40px 30px;
          border-radius: 16px;
          text-align: center;
          border: 1px solid #e6e6e6;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          background: white;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
          transform: translateY(-3px);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .video-wrapper {
          text-align: center;
          margin-top: 40px;
        }

        .video-wrapper iframe {
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .video-container {
          width: 100%;
          max-width: 560px;
          aspect-ratio: 560 / 405;
          position: relative;
          contain: layout style paint;
        }

        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .receipts-examples {
            padding: 30px 0 20px 0;
          }

          .examples-title {
            font-size: 1.5rem;
          }

          .examples-subtitle {
            font-size: 0.85rem;
            margin-bottom: 20px;
          }

          .receipts-grid {
            gap: 4px;
            max-width: 100%;
            overflow-x: auto;
            justify-content: flex-start;
            padding: 0 10px;
          }

          .receipt-image {
            width: 100px;
            height: 130px;
            aspect-ratio: 3 / 4;
          }
          
          .receipt-image img {
            width: 100%;
            height: 100%;
          }

          .luxury-brands,
          .luxury-features {
            padding: 60px 0;
          }

          .brands-title,
          .features-title {
            font-size: 2rem;
          }

          .brands-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .brand-card {
            padding: 30px 20px;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .feature-card {
            padding: 30px 20px;
          }

          .video-container {
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .receipts-grid {
            gap: 3px;
          }

          .receipt-image {
            width: 85px;
            height: 110px;
            aspect-ratio: 3 / 4;
          }
          
          .receipt-image img {
            width: 100%;
            height: 100%;
          }

          .examples-title,
          .brands-title,
          .features-title {
            font-size: 1.3rem;
          }

          .examples-subtitle,
          .brands-subtitle {
            font-size: 0.8rem;
            margin-bottom: 20px;
          }

        }

        @media (max-width: 360px) {
          .receipt-image {
            width: 75px;
            height: 100px;
            aspect-ratio: 3 / 4;
          }
          
          .receipt-image img {
            width: 100%;
            height: 100%;
          }
        }
        /* Subtle, accessible visible H1 */
        .seo-h1 {
          font-size: 1rem;
          font-weight: 600;
          color: #444;
          margin-bottom: 6px;
        }
      `}</style>
    </>
  );
}