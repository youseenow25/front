"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("auth_token", token);
      router.replace("/"); 
    }
  }, [searchParams, router]);

  return <p>Signing you in...</p>;
}



