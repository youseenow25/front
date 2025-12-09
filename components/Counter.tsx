"use client";

import { useEffect, useState } from "react";

export default function SubscriptionTimer() {
  const [timeLeft, setTimeLeft] = useState<string | number | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  useEffect(() => {
    const sub = localStorage.getItem("subscription");
    if (!sub) return;

    try {
      const parsed = JSON.parse(sub);
      if (parsed.timeLeft === "lifetime") {
        setTimeLeft("lifetime");
      } else if (parsed.expiryDate) {
        const expiry = new Date(parsed.expiryDate);
        setExpiryDate(expiry);

        const update = () => {
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
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
      }
    } catch (err) {
      console.error("Failed to parse subscription:", err);
    }
  }, []);

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
