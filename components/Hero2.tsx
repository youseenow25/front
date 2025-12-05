
"use client";

import Image from "next/image";

import React from "react";

import Counter from "@/components/Counter";

// Brand Logo Component
const BrandLogo = ({ brand, size = 20 }: { brand: string; size?: number }) => {
  const [logoError, setLogoError] = React.useState(false);
  
  const getLogoPath = (brandName: string) => {
    // Convert brand name to filename format
    const filename = brandName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') + '.png';
    
    return `/brand-logos/${filename}`;
  };

  if (logoError) {
    return (
      <div 
        className="brand-logo-fallback"
        style={{ 
          width: size, 
          height: size, 
          borderRadius: 4,
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.6,
          color: '#666',
          flexShrink: 0
        }}
      >
        {brand.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={getLogoPath(brand)}
      alt={`${brand} logo`}
      loading="lazy"
      width={size}
      height={size}
      sizes={`${size}px`}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        flexShrink: 0
      }}
      onError={() => setLogoError(true)}
    />
  );
};

interface HeroProps {
  brandName?: string;
}

export default function Hero({ brandName = "" }: HeroProps) {
  const phrases = [
    "✉️ +60 email templates",
    "🏆 Top #1 receipt generator ",
    "🌍 +6500 users worlwide using it",
  ];

  const brands = [
    "Acne Studios",
    "Adidas",
    "Amazon",
    "Apple",
    "Arc'teryx",
    "Argos",
    "Balenciaga",
    "Bape",
    "Best Secret",
    "Boots",
    "Breuninger",
    "Broken Planet",
    "Bulgari",
    "Burberry",
    "Canada Goose",
    "Cartier",
    "Cettire",
    "Chanel",
    "Chrono24",
    "Corteiz",
    "Culture Kings",
    "De Bijenkorf",
    "Denim Tears",
    "Dior",
    "Dyson",
    "eBay",
    "END.",
    "Farfetch",
    "Flannels",
    "Flight Club",
    "Frasers",
    "Gallery Dept",
    "GOAT",
    "Gucci",
    "Harrods",
    "Hermès",
    "JD Sports",
    "John Lewis",
    "Loro Piana",
    "Louis Vuitton",
    "Maison Margiela",
    "Moncler",
    "Neiman Marcus",
    "Nike",
    "Nordstrom",
    "The North Face",
    "Off-White",
    "Pacsun",
    "Pop Mort",
    "Prada",
    "Saint Laurent",
    "Nike SNKRS",
    "Sephora",
    "Sp5der",
    "SSENSE",
    "Stanley",
    "StockX",
    "Stüssy",
    "TaylorMade Golf",
    "Trapstar",
    "UGG",
    "Vinted",
    "Vivienne Westwood",
    "Xerjoff",
    "Yeezy Gap",
    "Zalando"
  ];

  // Duplicate brands to create seamless scroll
  const doubledBrands = [...brands, ...brands];

  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);
  const [blink, setBlink] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    if (subIndex === phrases[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1000);
      return;
    }

    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => (deleting ? prev - 1 : prev + 1));
    }, deleting ? 50 : 120);

    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting]);

  React.useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <section className="hero">
      <div style={{ width: '100%' }}>
        <h5 style={{ 
          fontSize: isMobile ? "clamp(2rem, 8vw, 3rem)" : "clamp(3.5rem, 5vw, 5rem)", 
          fontWeight: 500,
          lineHeight: 1.2,
          marginBottom: "1rem",
          textAlign: "center"
        }}>
          {phrases[index].substring(0, subIndex)}
          <span style={{ opacity: blink ? 1 : 0 }}>|</span>
        </h5>

        {/* CTA Banner */}
        <div
          className="cta"
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: isMobile ? "wrap" : "nowrap",
            width: '100%'
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textAlign: "center",
              justifyContent: "center",
              width: '100%'
            }}
          >
            <div
              style={{
                padding: "4px 10px",
                backgroundColor: "#e9f4ff",
                display: "flex",
                alignItems: "center",
              }}
            >
              <p style={{ color: "#0060f2", fontWeight: "500", margin: 0, fontSize: isMobile ? "14px" : "16px" }}>
                New
              </p>
            </div>

            {isMobile
              ? "For any assistance, go to"
              : "For any assistance or help, contact us at this Discord"}
            <br />

            <a
              href="https://discord.gg/2ZRQu2uT62"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "3px 16px",
                backgroundColor: "#5462ea",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <p style={{ 
                color: "white", 
                fontWeight: "500", 
                margin: 0, 
                fontSize: isMobile ? "14px" : "16px",
                display: "flex",
                alignItems: "center",
                gap: 4,
                whiteSpace: "nowrap"
              }}>
                Discord <span style={{ fontSize: "14px" }}>↗</span>
              </p>
            </a>
          </div>
        </div>

        <div
          style={{
            width: '90%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto'
          }}
        >
          <Counter />
        </div>

        {/* Scrolling Brand Rows - Reduced spacing */}
        <div style={{ 
          marginTop: isMobile ? '5%' : '1%',
          width: '100%',
          padding: isMobile ? '0 16px' : '0 20px'
        }} className="overflow-hidden space-y-2">
          {/* Row 1 (Right → Left) */}
          <div className="w-full overflow-hidden">
            <ul className="flex animate-marquee-slow gap-2">
              {doubledBrands.map((brand, index) => (
                <li
                  key={`row1-${index}`}
                  className="flex items-center justify-center px-4 py-2 shadow flex-shrink-0"
                  style={{
                    background: "#efefef",
                    whiteSpace: "nowrap",
                    padding: isMobile ? '6px 12px' : '8px 16px',
                    fontSize: isMobile ? '12px' : '14px',
                    gap: '8px'
                  }}
                >
                  <BrandLogo brand={brand} size={isMobile ? 16 : 20} />
                  <span style={{ 
                    fontWeight: 500,
                    color: '#333'
                  }}>
                    {brand}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Row 2 (Left → Right) */}
          <div className="w-full overflow-hidden">
            <ul className="flex animate-marquee-reverse-slow gap-2">
              {doubledBrands.map((brand, index) => (
                <li
                  key={`row2-${index}`}
                  className="flex items-center justify-center px-4 py-2 shadow flex-shrink-0"
                  style={{
                    background: "#efefef",
                    whiteSpace: "nowrap",
                    padding: isMobile ? '6px 12px' : '8px 16px',
                    fontSize: isMobile ? '12px' : '14px',
                    gap: '8px'
                  }}
                >
                  <BrandLogo brand={brand} size={isMobile ? 16 : 20} />
                  <span style={{ 
                    fontWeight: 500,
                    color: '#333'
                  }}>
                    {brand}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .hero {
          padding: ${isMobile ? '40px 0px 0px' : '20px 0px 0px'};
          text-align: center;
          position: relative;
          z-index: 1;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
        }

        .btn {
          padding: 8px 40px;
          font-size: 16px;
          border: 1px solid #ccc;
          background: #f9f9f9;
          color: #000;
          transition: all 0.2s ease;
        }

        .btn:hover {
          background: #eee;
        }

        .btn-primary {
          background: #000;
          color: "white";
          border-color: #000;
        }

        @keyframes marquee-slow {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse-slow {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }

        .animate-marquee-slow {
          animation: marquee-slow 60s linear infinite;
          width: max-content;
        }

        .animate-marquee-reverse-slow {
          animation: marquee-reverse-slow 60s linear infinite;
          width: max-content;
        }

        /* Mobile optimizations */
        @media (max-width: 767px) {
          .animate-marquee-slow, .animate-marquee-reverse-slow {
            animation-duration: 40s;
          }
        }
      `}</style>
    </section>
  );
}