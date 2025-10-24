"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password validation
  const validatePassword = (password: string) => {
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 7;
    return hasNumber && hasMinLength;
  };

  const getPasswordRequirements = () => {
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 7;
    
    return {
      number: hasNumber,
      length: hasMinLength,
      isValid: hasNumber && hasMinLength
    };
  };

  const passwordRequirements = getPasswordRequirements();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate password
    if (!validatePassword(password)) {
      setError("Password must be at least 7 characters long and include at least one number");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("https://api.hubreceipts.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Save all data to localStorage as specified
        localStorage.setItem("auth_token", data.token);
        
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        if (data.subscription) {
          localStorage.setItem("subscription", JSON.stringify(data.subscription));
        }
        
        console.log("✅ Registration successful - Data saved to localStorage:");
        console.log("Token:", data.token);
        console.log("User:", data.user);
        console.log("Subscription:", data.subscription);
        
        router.push("/");
      } else {
        const err = await res.json();
        setError(err.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image width={150} height={150} src={"/hublogo.png"} alt="Hub Logo" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm ${
                    password && !passwordRequirements.isValid 
                      ? 'border-yellow-500' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
              </div>
              {/* Password Requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className={`text-xs flex items-center ${
                    passwordRequirements.length ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    <span className="mr-1">{passwordRequirements.length ? '✓' : '○'}</span>
                    At least 7 characters
                  </div>
                  <div className={`text-xs flex items-center ${
                    passwordRequirements.number ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    <span className="mr-1">{passwordRequirements.number ? '✓' : '○'}</span>
                    Contains at least one number
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm ${
                    confirmPassword && password !== confirmPassword 
                      ? 'border-red-500' 
                      : confirmPassword && password === confirmPassword
                      ? 'border-green-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <div className="mt-1 text-xs text-red-600">
                  Passwords do not match
                </div>
              )}
              {confirmPassword && password === confirmPassword && passwordRequirements.isValid && (
                <div className="mt-1 text-xs text-green-600">
                  ✓ Passwords match
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || !passwordRequirements.isValid || password !== confirmPassword}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  <span style={{fontSize:20, fontWeight:'600'}}>
                    Create account
                  </span>
                )}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    By creating an account, you agree to our Terms
                  </span>
                </div>
              </div>
            </div>
          </form>

          <style jsx>{`
            .min-h-screen {
              min-height: 100vh;
            }
            .bg-gray-50 {
              background-color: #f9fafb;
            }
            .flex {
              display: flex;
            }
            .flex-col {
              flex-direction: column;
            }
            .justify-center {
              justify-content: center;
            }
            .py-12 {
              padding-top: 3rem;
              padding-bottom: 3rem;
            }
            .sm\\:px-6 {
              @media (min-width: 640px) {
                padding-left: 1.5rem;
                padding-right: 1.5rem;
              }
            }
            .lg\\:px-8 {
              @media (min-width: 1024px) {
                padding-left: 2rem;
                padding-right: 2rem;
              }
            }
            .sm\\:mx-auto {
              @media (min-width: 640px) {
                margin-left: auto;
                margin-right: auto;
              }
            }
            .sm\\:w-full {
              @media (min-width: 640px) {
                width: 100%;
              }
            }
            .sm\\:max-w-md {
              @media (min-width: 640px) {
                max-width: 28rem;
              }
            }
            .flex {
              display: flex;
            }
            .justify-center {
              justify-content: center;
            }
            .w-12 {
              width: 3rem;
            }
            .h-12 {
              height: 3rem;
            }
            .bg-black {
              background-color: #000;
            }
            .rounded-lg {
              border-radius: 0.5rem;
            }
            .items-center {
              align-items: center;
            }
            .text-white {
              color: #fff;
            }
            .font-bold {
              font-weight: 700;
            }
            .text-xl {
              font-size: 1.25rem;
            }
            .mt-6 {
              margin-top: 1.5rem;
            }
            .text-center {
              text-align: center;
            }
            .text-3xl {
              font-size: 1.875rem;
            }
            .font-extrabold {
              font-weight: 800;
            }
            .text-gray-900 {
              color: #111827;
            }
            .mt-2 {
              margin-top: 0.5rem;
            }
            .text-sm {
              font-size: 0.875rem;
            }
            .text-gray-600 {
              color: #4b5563;
            }
            .font-medium {
              font-weight: 500;
            }
            .text-blue-600 {
              color: #528cfa;
            }
            .hover\\:text-blue-500:hover {
              color: #3a7bf8;
            }
            .transition-colors {
              transition-property: color, background-color, border-color;
              transition-duration: 150ms;
            }
            .mt-8 {
              margin-top: 2rem;
            }
            .bg-white {
              background-color: #fff;
            }
            .py-8 {
              padding-top: 2rem;
              padding-bottom: 2rem;
            }
            .px-4 {
              padding-left: 1rem;
              padding-right: 1rem;
            }
            .shadow {
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            }
            .sm\\:rounded-lg {
              @media (min-width: 640px) {
                border-radius: 0.5rem;
              }
            }
            .sm\\:px-10 {
              @media (min-width: 640px) {
                padding-left: 2.5rem;
                padding-right: 2.5rem;
              }
            }
            .space-y-6 > * + * {
              margin-top: 1.5rem;
            }
            .block {
              display: block;
            }
            .px-3 {
              padding-left: 0.75rem;
              padding-right: 0.75rem;
            }
            .py-2 {
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
            }
            .border {
              border-width: 1px;
            }
            .border-gray-300 {
              border-color: #d1d5db;
            }
            .rounded-md {
              border-radius: 0.375rem;
            }
            .placeholder-gray-400::placeholder {
              color: #9ca3af;
            }
            .focus\\:outline-none:focus {
              outline: 2px solid transparent;
              outline-offset: 2px;
            }
            .focus\\:ring-blue-500:focus {
              --ring-color: #528cfa;
              box-shadow: 0 0 0 3px rgba(82, 140, 250, 0.1);
            }
            .focus\\:border-blue-500:focus {
              border-color: #528cfa;
            }
            .sm\\:text-sm {
              @media (min-width: 640px) {
                font-size: 0.875rem;
              }
            }
            .w-full {
              width: 100%;
            }
            .appearance-none {
              appearance: none;
            }
            .rounded-md {
              border-radius: 0.375rem;
            }
            .bg-red-50 {
              background-color: #fef2f2;
            }
            .p-4 {
              padding: 1rem;
            }
            .flex-shrink-0 {
              flex-shrink: 0;
            }
            .h-5 {
              height: 1.25rem;
            }
            .w-5 {
              width: 1.25rem;
            }
            .text-red-400 {
              color: #f87171;
            }
            .ml-3 {
              margin-left: 0.75rem;
            }
            .text-red-800 {
              color: #991b1b;
            }
            .group {
              position: relative;
            }
            .relative {
              position: relative;
            }
            .border-transparent {
              border-color: transparent;
            }
            .bg-blue-600 {
              background-color: #528cfa;
            }
            .hover\\:bg-blue-700:hover {
              background-color: #3a7bf8;
            }
            .focus\\:ring-2:focus {
              box-shadow: 0 0 0 2px var(--ring-color, currentColor);
            }
            .focus\\:ring-blue-500:focus {
              --ring-color: #528cfa;
            }
            .focus\\:ring-offset-2:focus {
              --ring-offset: 2px;
            }
            .disabled\\:opacity-50:disabled {
              opacity: 0.5;
            }
            .disabled\\:cursor-not-allowed:disabled {
              cursor: not-allowed;
            }
            .animate-spin {
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .-ml-1 {
              margin-left: -0.25rem;
            }
            .mr-3 {
              margin-right: 0.75rem;
            }
            .absolute {
              position: absolute;
            }
            .inset-0 {
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
            }
            .items-center {
              align-items: center;
            }
            .border-t {
              border-top-width: 1px;
            }
            .border-gray-300 {
              border-color: #d1d5db;
            }
            .px-2 {
              padding-left: 0.5rem;
              padding-right: 0.5rem;
            }
            .text-gray-500 {
              color: #6b7280;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}