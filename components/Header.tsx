"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, X, ChevronRight } from "lucide-react";

import { Lock } from 'lucide-react';


interface User {
  name: string;
  email: string;
  image_url: string | null;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state to avoid hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if mobile on mount and resize - only after component mounts
  useEffect(() => {
    if (!isMounted) return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isMounted]);

  // ✅ Get user data from localStorage - only after component mounts
  useEffect(() => {
    if (!isMounted) return;

    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("auth_token");
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
      }
    }
  }, [isMounted]);

  const goToLogin = () => {
    router.push("/login");
    setIsMobileMenuOpen(false);
  };

  const goToRegister = () => {
    router.push("/register");
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("subscription");
    setUser(null);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  // Mobile Menu Component
  const MobileMenu = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "white", // full white background
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      overflowY: "auto",
      padding: "24px",
    }}
  >
    {/* Top: Header */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <button
        onClick={() => navigateTo("/")}
        style={{ display: "flex", alignItems: "center", gap: 8, border: "none", background: "none" }}
      >
        <Image width={60} height={60} alt="Logo" src={"/logoheader.png"} />
      </button>
      <button onClick={toggleMobileMenu} style={{ border: "none", background: "none" }}>
        <X size={28} color="black" />
      </button>
    </div>

    {/* Middle: Navigation Links */}
    <div style={{ display: "flex", flexDirection: "column", gap: 24, textAlign: "center" }}>
      <button
        onClick={() => navigateTo("/pricing")}
        style={{
          background: "none",
          border: "none",
          fontSize: 20,
          fontWeight: 600,
          color: "#000",
          cursor: "pointer",
        }}
      >
        💰 Pricing
      </button>

      <button
        onClick={() => navigateTo("/#examples")}
        style={{
          background: "none",
          border: "none",
          fontSize: 20,
          fontWeight: 600,
          color: "#000",
          cursor: "pointer",
        }}
      >
        🧾 Examples of Usage
      </button>

      <button
        onClick={() => navigateTo("/#faq")}
        style={{
          background: "none",
          border: "none",
          fontSize: 20,
          fontWeight: 600,
          color: "#000",
          cursor: "pointer",
        }}
      >
        ❓ FAQ
      </button>
    </div>

    {/* Bottom: Auth Actions */}
    <div style={{ borderTop: "1px solid #eee", paddingTop: 20 }}>
      {user ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              color: "#000",
              fontWeight: 500,
              fontSize: "16px",
              padding: "12px 16px",
              backgroundColor: "#f8f9fa",
              borderRadius: 8,
              border: "1px solid #ddd",
              textAlign: "center",
            }}
          >
            {user.email}
          </div>

          <button
            onClick={handleLogout}
            style={{
              color: "#e53e3e",
              padding: "12px 16px",
              border: "2px solid #e53e3e",
              borderRadius: 8,
              fontWeight: 500,
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            onClick={goToRegister}
            style={{
              backgroundColor: "#4468f9",
              color: "white",
              padding: "12px 16px",
              border: "none",
              fontWeight: 600,
              borderRadius: 10,
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Sign up for Free
          </button>

          <button
            onClick={goToLogin}
            style={{
              backgroundColor: "#efefef",
              color: "black",
              padding: "12px 16px",
              border: "none",
              fontWeight: 600,
              borderRadius: 10,
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Log in
          </button>
        </div>
      )}
    </div>
  </div>
);


  // Don't render anything until component is mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid #eee",
          backgroundColor: "white",
          height: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 80,
            padding: "0 20px",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          {/* Simple static header during SSR */}
          <button onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Image width={110} height={110} alt="Webpage logo" src={'/hublogo.png'} />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid #eee",
        backgroundColor: "white",
      }}
    >
      <div
        className="container nav"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: isMobile ? 60 : 80,
          padding: isMobile ? "0 16px" : "0px 20px",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        {/* Left: Brand */}
        <button onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Image 
            width={isMobile ? 60 : 90} 
            height={isMobile ? 60 : 900} 
            alt="Webpage logo" 
            src={'/logoheader.png'} 
          />
        </button>

        {/* Center: Navigation Links (Desktop only) */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              position: "relative",
            }}
          >
            {/* Pricing */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => router.push('pricing')}
                style={{
                  background: "none",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                  fontWeight: 500,
                  color: "#000",
                  fontSize: "16px",
                  padding: "8px 12px",
                  borderRadius: 6,
                }}
              >
                <span style={{ color: 'black', fontWeight:'bold' }}>
                  💰 Pricing
                </span>
                   <ChevronRight size={20}/>
               
              </button>

              {activeDropdown === 'pricing' && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  backgroundColor: "white",
                  border: "1px solid #eee",
                  borderRadius: 8,
                  padding: "8px 0",
                  minWidth: 160,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}>
                  <a href="#free-plan" style={{ display: "block", padding: "8px 16px", textDecoration: "none", color: "#000" }}>
                    💰 Free Plan
                  </a>
                  <a href="#pro-plan" style={{ display: "block", padding: "8px 16px", textDecoration: "none", color: "#000" }}>
                    💎 Pro Plan
                  </a>
                  <a href="#enterprise" style={{ display: "block", padding: "8px 16px", textDecoration: "none", color: "#000" }}>
                    🏢 Enterprise
                  </a>
                </div>
              )}
            </div>

            {/* Examples */}
            <a
              href="#examples"
              style={{
                textDecoration: "none",
                color: "#000",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "8px 12px",
                borderRadius: 6,
              }}
            >
               <span style={{ color: 'black', fontWeight:'bold' }}>
               ✨ Examples of usage
              </span>
                 <ChevronRight size={20}/>
            </a>

            {/* FAQ */}
            <a
              href="#faq"
              style={{
                textDecoration: "none",
                color: "#000",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "8px 12px",
                borderRadius: 6,
              }}
            >
                 <span style={{ color: 'black', fontWeight:'bold' }}>
               ❓ FAQ
              </span>
              <ChevronRight size={20}/>
            </a>
          </div>
        )}

        {/* Right: Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          

          {user ? (
            /* User is authenticated */
            !isMobile ? (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ 
                  color: "#000", 
                  fontWeight: 500,
                  fontSize: "14px",
                  padding: "8px 12px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: 8,
                  border: "1px solid #ddd"
                }}>
                  {user.email}
                </div>
                
                <button
                  onClick={handleLogout}
                  style={{
                    color: "#e53e3e",
                    padding: "8px 25px",
                    border: "2px solid #e53e3e",
                    borderRadius: 8,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontSize: "14px",
                    backgroundColor: "white"
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={toggleMobileMenu}
                style={{ background: "none", border: "none", padding: 8 }}
              >
                <Menu size={24} color="black" />
              </button>
            )
          ) : (
            /* User is not authenticated */
            !isMobile ? (
              <>
                
                <button
                  onClick={goToLogin}
                  style={{
                    background:'#efefef',
                    display:'flex',
                
              
                
                    
                    color: "white",
                    padding: "10px 50px",
                 
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    
                    borderColor:"gray",
               
                    cursor: "pointer",
                    alignItems:'center',
                    gap:5
                  }}
                >
                    <Lock size={18} color="black" className="icon-lock" />
                  <span style={{color:'black'}} >
                       Log in

                  </span>
                
                </button>
                <button
                  onClick={goToRegister}
                  style={{
                    backgroundColor: "#4468f9",
                    color: "white",
                    padding: "10px 40px",
                    border: "none",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
               
                    cursor: "pointer",
                  }}
                >
                  Sign up For Free
                </button>

              </>
            ) : (
              <button
                onClick={toggleMobileMenu}
                style={{ background: "none", border: "none", padding: 8 }}
              >
                <Menu size={24} color="black" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <MobileMenu />}
    </header>
  );
}

function BrandIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" stroke="black" strokeOpacity=".9" />
      <circle cx="12" cy="12" r="3" fill="#00E5A8" />
    </svg>
  );
}