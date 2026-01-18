"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <Image
          src="/orbit-logo.svg"
          alt="Orbit"
          className="mx-auto mb-6"
          width={100}
          height={100}
        />

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
        <Button
          type="button"
          className="w-full"
          onClick={handleSignIn}
          disabled={isLoading}
        >
          {/* Button shine effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              transform: "translateX(-100%)",
            }}
          />

          {isLoading ? (
            <div className="w-5 h-5 border border-zinc-600 border-t-white rounded-full animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <title>Twitter</title>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          )}
          <span>{isLoading ? "Connecting..." : "Continue with X"}</span>
        </Button>
      </div>
    </div>
  );
}
