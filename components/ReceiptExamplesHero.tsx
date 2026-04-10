import Image from "next/image";
import Link from "next/link";

const brands = [
  "apple", "gucci", "stockx", "nike", "flightclub", "louisvuitton", "saintlaurent", "trapstar"
];

function toLabel(name: string): string {
  const special: Record<string, string> = {
    stockx: "StockX",
    louisvuitton: "Louis Vuitton",
    saintlaurent: "Saint Laurent",
    flightclub: "Flight Club",
    trapstar: "Trapstar",
  };
  if (special[name]) return special[name];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function ReceiptExamplesHero() {
  return (
    <>
      <section className="container" style={{ padding: '12px 20px 0 20px', textAlign: 'center' }}>
        <h1 className="seo-h1">
          Receipt Generator for StockX, Nike, Louis Vuitton & 100+ Brands
        </h1>
        <p style={{ maxWidth: 760, margin: '0 auto', color: '#444', fontSize: '1rem', lineHeight: 1.6 }}>
          Create professional email receipts, printable templates and PDF invoices for over 100 luxury and streetwear brands. Free online receipt maker.
        </p>
      </section>

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
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, width: '150%', background: 'linear-gradient(90deg, transparent, #d4af37, #c9b037, transparent)' }} />

      <style>{`
        .seo-h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #d4af37, #c9b037);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .receipts-examples {
          padding: 20px 0 10px 0;
          background: transparent;
          position: relative;
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

        @media (max-width: 768px) {
          .receipts-examples {
            padding: 15px 0 8px 0;
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
          }
        }

        @media (max-width: 480px) {
          .receipts-grid {
            gap: 3px;
          }

          .receipt-image {
            width: 85px;
            height: 110px;
          }
        }

        @media (max-width: 360px) {
          .receipt-image {
            width: 75px;
            height: 100px;
          }
        }
      `}</style>
    </>
  );
}
