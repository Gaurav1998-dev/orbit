"use client";

import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn();
    } catch (error) {
      console.error("Sign in failed:", error);
      setIsLoading(false);
    }
  };

  const getTextQuery = useQuery(trpc.getText.queryOptions({ foo: "bar" }));
  
  if (getTextQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (getTextQuery.error) {
    return <div>Error: {getTextQuery.error.message}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Accent glow - top right */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-[120px]" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="flex items-center justify-center mb-12">
          <div className="relative">
            <div className="w-12 h-12 border border-zinc-800 rounded-xl flex items-center justify-center bg-zinc-950">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <title>X-Ray</title>
                <text
                  x="12"
                  y="17"
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill="currentColor"
                  stroke="none"
                >
                  G
                </text>
              </svg>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl -z-10" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-8">
          <p className="text-zinc-500 text-sm font-light tracking-wide">
            {getTextQuery.data?.message}
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        {/* Sign In Button */}
        <button
          type="button"
          onClick={handleSignIn}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={isLoading}
          className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          style={{
            background: isHovered
              ? "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)"
              : "linear-gradient(135deg, #18181b 0%, #09090b 100%)",
            border: "1px solid",
            borderColor: isHovered ? "#ffffff" : "#27272a",
          }}
        >
          {/* Button shine effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              transform: "translateX(-100%)",
              animation: isHovered ? "shine 0.75s ease-out" : "none",
            }}
          />

          {isLoading ? (
            <div className="w-5 h-5 border border-zinc-600 border-t-white rounded-full animate-spin" />
          ) : (
            <svg
              className={`w-5 h-5 transition-colors duration-300 ${
                isHovered ? "text-black" : "text-white"
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <title>Twitter</title>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          )}
          <span
            className={`transition-colors duration-300 ${
              isHovered ? "text-black" : "text-white"
            }`}
          >
            {isLoading ? "Connecting..." : "Continue with X"}
          </span>
        </button>

        {/* Alternative sign in options hint */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
}
