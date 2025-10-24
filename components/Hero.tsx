"use client";
import React from "react";

import Counter from "@/components/Counter";
export default function Hero() {
  const phrases = [
    "✉️ +60 email templates",
    "🏆 Top #1 receipt generator ",
    "🌍 +6500 users worlwide using it",
  ];

  const brands = [
    "Louis Vuitton", "Dior", "Chanel", "Hermès", "Gucci", "Rolex", "Cartier",
    "Prada", "Saint Laurent", "Balenciaga", "Burberry", "Tiffany & Co.",
    "Bottega Veneta", "Versace", "Fendi", "Givenchy", "Valentino", "Celine",
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
      <div className="container">
        <h5 style={{ 
          fontSize: isMobile ? "clamp(2rem, 8vw, 3rem)" : "clamp(3.5rem, 5vw, 5rem)", 
          fontWeight: 500,
          lineHeight: 1.2,
          marginBottom: "1rem"
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
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textAlign: "center",
          
              justifyContent: "center",
            }}
          >
            <div
              style={{
                padding: "4px 10px",
                backgroundColor: "#e9f4ff",
                display: "flex",
                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <p style={{ color: "#0060f2", fontWeight: "500", margin: 0, fontSize: isMobile ? "14px" : "16px" }}>
                New
              </p>
            </div>

            <p style={{ fontSize: isMobile ? "14px" : "18px", color: "#555", margin: isMobile ? "8px 0" : "0" }}>
              For any help, contact us at this Discord
            </p>

            <a
              href="https://discord.gg/Mn8ZJTgcz5"
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
                whiteSpace: "nowrap" // Prevent text wrapping
              }}>
                Discord <span style={{ fontSize: "14px" }}>↗</span>
              </p>
            </a>
           
          </div>
          
        </div>
         <Counter/>

        {/* Scrolling Brand Rows */}
        <div style={{marginTop: isMobile ? '10%' : '1%', width:'100%'}} className="overflow-hidden space-y-20 mt-20">
          {/* Row 1 (Right → Left) */}
          <ul className="flex animate-marquee gap-4">
            {doubledBrands.map((brand, index) => (
              <li
                key={`row1-${index}`}
                className="flex items-center justify-center px-100 py-20 shadow"
                style={{
                  background: "#efefef",
                  whiteSpace: "nowrap",
                  padding: isMobile ? '2px 6px' : '3px 8px',
                  fontSize: isMobile ? '12px' : '14px',
                  borderRadius: 4,
                }}
              >
                {brand}
              </li>
            ))}
          </ul>

          {/* Row 2 (Left → Right) */}
          <ul style={{marginTop: isMobile ? 3 : 5, width:'100%'}} className="flex animate-marquee-reverse gap-4">
            {doubledBrands.map((brand, index) => (
              <li
                key={`row2-${index}`}
                className="flex items-center justify-center px-4 py-2 shadow"
                style={{
                  background: "#efefef",
                  whiteSpace: "nowrap",
                  padding: isMobile ? '2px 6px' : '3px 8px',
                  fontSize: isMobile ? '12px' : '14px',
                  borderRadius: 4,
                }}
              >
                {brand}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .hero {
          padding: ${isMobile ? '40px 16px 0px' : '20px 20px 0px'};
          text-align: center;
          position: relative;
          z-index: 1;
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

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 ${isMobile ? '16px' : '20px'};
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }

        .animate-marquee {
          animation: marquee 25s linear infinite;
          width: max-content;
        }

        .animate-marquee-reverse {
          animation: marquee-reverse 25s linear infinite;
          width: max-content;
        }

        /* Mobile optimizations */
        @media (max-width: 767px) {
          .animate-marquee, .animate-marquee-reverse {
            animation-duration: 20s;
          }
        }
      `}</style>
    </section>
  );
}