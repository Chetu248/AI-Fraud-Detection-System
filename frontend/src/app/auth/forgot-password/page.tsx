"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  KeyRound,
  Loader2,
  Mail,
  Send,
} from "lucide-react";

import { authApi } from "@/lib/api/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await authApi.forgotPassword({
        email,
      });

      setMessage(
        "If an account exists with this email, password reset instructions have been sent."
      );
      setEmail("");
    } catch {
      setError(
        "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#10233f] px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(110,231,216,0.18),transparent_30%),radial-gradient(circle_at_85%_85%,rgba(49,88,212,0.28),transparent_35%)]" />
      <div className="w-full max-w-md">
        <Card className="relative border-white/10 bg-white shadow-2xl">
          <CardHeader className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KeyRound className="h-6 w-6" />
            </div>

            <div>
              <CardTitle className="text-2xl">
                Forgot Password?
              </CardTitle>

              <CardDescription className="mt-2">
                Enter your email address and we&apos;ll send
                you instructions to reset your password.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address
                </Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    className="pl-9"
                    required
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-lg border bg-muted/50 px-4 py-3 text-sm">
                  {message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Reset Instructions
                  </>
                )}
              </Button>

              <div className="flex justify-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
