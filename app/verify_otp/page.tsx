"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  ShieldCheck,
  AlertCircle,
  MonitorSmartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { useUser } from "@/providers/UserProvider";

const OTP_LENGTH = 6;

// If you're passing userId and email via search params, use this instead:
// const searchParams = useSearchParams();
// const userId = searchParams.get("userId");
// const email = searchParams.get("email");

export default function OtpPage() {
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { setUser } = useUser();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    // Handle paste
    if (value.length > 1) {
      const pasted = value.slice(0, OTP_LENGTH).split("");
      pasted.forEach((char, i) => {
        if (i < OTP_LENGTH) newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");

    if (otpValue.length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post("api/auth/verify_otp", { otp: otpValue });

      const data = res.data;

      console.log("OTP Verification Response : ", data);

      if (data.isSuccess) {
        setUser(res.data.user);
        setSuccess(true);

        setTimeout(
          () =>
            res.data.user.role === "admin"
              ? router.push("/dashboard")
              : router.push("/user"),
          1500,
        );
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <MonitorSmartphone className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            New Device Detected
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground leading-relaxed">
            We sent a 6-digit code to your email
            <br />
            Enter it below to verify your device.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, i) => (
              <Input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-13 text-center text-xl font-bold tracking-widest focus:ring-2 focus:ring-primary"
                disabled={isLoading || success}
              />
            ))}
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="py-2 border-green-500 bg-green-50 text-green-800">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Device verified! Redirecting you...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-0">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!isComplete || isLoading || success}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : success ? (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Verified!
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Didn&apos;t receive the code?{" "}
            <button
              className="text-primary underline underline-offset-2 hover:opacity-80 disabled:opacity-40"
              disabled={isLoading || success}
              onClick={() => {
                // TODO: hook up a resend OTP endpoint here
                console.log("Resend OTP");
              }}
            >
              Resend
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
