"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        background: "white",
        zIndex: 10,
        borderBottom: "1px solid #eee",
      }}
    >
      <div
        className="container nav"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 120,
          padding: "0px 100px",
          maxWidth: '100%',
          margin: "10 auto",
        }}
      >
        {/* Left: Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BrandIcon />
          <strong style={{ fontSize: 16 }}>FLUX</strong>
        </div>


        <nav style={{ display: "flex", gap: 20 }}>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
        </nav>


        <div
       
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 5,
            
          }}
        >

          <div style={{ display: "flex", gap: 4 }}>
       
            <a
              href="https://discord.gg/your-server"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#5462ea",
                padding: "8px 16px",
                color: "white",
              
                display: "flex",
                alignItems: "center",
                gap: 4,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <Image src="/discord.png" alt="Discord" width={20} height={20} />
              <span style={{ fontWeight: 500 }}>Go to Discord</span>
              <span style={{ fontSize: 18, lineHeight: 1 }}>↗</span>
            </a>

            {/* Sign Up */}
            <a
              href="#"
              className="btn btn-primary"
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "8px 70px",
          
                border: "1px solid #000",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Sign Up →
            </a>
          </div>

          <div style= {{display:'flex'}} >

      

          {/* Bottom: Log In (matches combined width of the row above) */}
          <a
            href="#"
            style={{
              width: "100%", // <-- fills the inline-flex container width (i.e., the row above)
              backgroundColor: "#efefef",
          
              height: 40,
        
              
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
            }}
          >
            Log In →
          </a>

          {/* Bottom: Log In (matches combined width of the row above) */}
          <a
            href="#"
            style={{
              width: "100%", // <-- fills the inline-flex container width (i.e., the row above)
              backgroundColor: "#efefef",
          
              height: 40,
              marginLeft:5,
        
              
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
            }}
          >
            💰Affiliates →
          </a>

              </div>
          
        </div>
      </div>
    </header>
  );
}

function BrandIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" stroke="black" strokeOpacity=".9" />
      <circle cx="12" cy="12" r="3" fill="#00E5A8" />
    </svg>
  );
}
