"use client";

import { useEffect, useState } from "react";

export default function SubscriptionTimer() {
  const [timeLeft, setTimeLeft] = useState<string | number | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    try {
      const token = localStorage.getItem("auth_token");
      const user = localStorage.getItem("user");
      if (!token || !user) {
        setShouldShow(false);
        setTimeLeft(null);
        setExpiryDate(null);
        return;
      }

      const sub = localStorage.getItem("subscription");
      if (!sub) {
        setShouldShow(false);
        setTimeLeft(null);
        setExpiryDate(null);
        return;
      }

      try {
        const parsed = JSON.parse(sub);
        const hasPlan = Boolean(parsed.plan || parsed.timeLeft || parsed.expiryDate);
        if (!hasPlan) {
          setShouldShow(false);
          setTimeLeft(null);
          setExpiryDate(null);
          return;
        }

        setShouldShow(true);

        if (parsed.timeLeft === "lifetime") {
          setTimeLeft("lifetime");
          return;
        }

        if (parsed.timeLeft === "single") {
          setTimeLeft("single");
          return;
        } else if (parsed.expiryDate) {
          const expiry = new Date(parsed.expiryDate);
          if (isNaN(expiry.getTime())) {
            setShouldShow(false);
            setTimeLeft(null);
            setExpiryDate(null);
            return;
          }
          setExpiryDate(expiry);

          const update = () => {
            try {
              const now = new Date();
              const diff = expiry.getTime() - now.getTime();

              if (diff <= 0) {
                setTimeLeft(0);
                return;
              }

              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
              const minutes = Math.floor((diff / (1000 * 60)) % 60);
              const seconds = Math.floor((diff / 1000) % 60);

              setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } catch (err) {
              console.error("Error updating timer:", err);
            }
          };

          update();
          const interval = setInterval(update, 1000);
          return () => clearInterval(interval);
        } else {
          // Fallback: if no usable time data, hide the banner
          setShouldShow(false);
          setTimeLeft(null);
          setExpiryDate(null);
        }
      } catch (err) {
        console.error("Failed to parse subscription:", err);
        setShouldShow(false);
        setTimeLeft(null);
        setExpiryDate(null);
      }
    } catch (err) {
      console.error("Error accessing localStorage:", err);
      setShouldShow(false);
      setTimeLeft(null);
      setExpiryDate(null);
    }
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: 10,
        width:'95%',
        padding: "8px 12px",
        backgroundColor: "#e9ecff",
        color: "#333",
        textAlign: "center",
        fontWeight: 500,
        minHeight: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
     {timeLeft === "lifetime" ? (
  <p style={{ margin: 0 }}>🎉 Lifetime Access</p>
) : timeLeft === 0 ? (
  <p style={{ margin: 0, color: "red" }}>⏰ Subscription expired</p>
) : timeLeft === "single" ? (
  <p style={{ margin: 0 }}>🧾 You can make 1 receipt</p>
) : timeLeft ? (
  <p style={{ margin: 0 }}>⏳ Time left: {timeLeft}</p>
) : (
  <p style={{ margin: 0, visibility: "hidden" }}>⏳ Time left: 0d 0h 0m 0s</p>
)}

    </div>
  );
}
