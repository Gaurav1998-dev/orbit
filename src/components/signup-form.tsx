"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 flex flex-col justify-center">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-sm text-balance">
                Sign in to continue to Orbit
                </p>
              </div>
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

                <svg viewBox="0 0 24 24" fill="currentColor">
                  <title>Twitter</title>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>

                <span>Continue with X</span>
              </Button>
            </FieldGroup>
          </form>
          {/* Right side */}
          <div className="bg-muted flex flex-col items-center justify-center py-10">
            <Image
              src="/orbit-logo.svg"
              alt="Orbit Logo"
              className="w-3/5"
              width={100}
              height={100}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
