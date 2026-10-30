"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { authApi } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/error";
import { useAuthStore } from "@/store/auth-store";
import { getRoleDashboard } from "@/lib/auth/role-router";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { FraudEngineVisual } from "@/components/branding/fraud-engine-visual";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// NOTE: this is the ONLY login page in the app. The backend determines the
// user's role from `POST /auth/login` — there is no role selector here and
// there must never be one (see docs/api_contract.md).
const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setServerError("");

    try {
      const response = await authApi.login(data);

      login(
        {
          userId: response.userId,
          email: response.email,
          role: response.role,
        },
        response.accessToken,
        response.refreshToken
      );

      const redirect = searchParams.get("redirect");

      if (redirect) {
        router.replace(redirect);
      } else {
        router.replace(
          getRoleDashboard(response.role)
        );
      }
    } catch (error: unknown) {
      setServerError(
        getApiErrorMessage(error, "Invalid email or password.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen bg-background lg:grid-cols-2">
      {/* Theme toggle floats over both panes */}
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle className="text-foreground hover:bg-foreground/10 lg:text-white lg:hover:bg-white/10" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Branding / visual pane                                         */}
      {/* ------------------------------------------------------------- */}
      <div className="relative hidden overflow-hidden bg-[#050505] px-12 py-16 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-40" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-[color:var(--brand-violet)]/20 blur-3xl" />

        <Link href="/" className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_22px_-4px_rgba(79,125,251,0.6)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">InsureGuard</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            AI-powered insurance intelligence.
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            One secure sign-in for customers, investigators,
            managers and administrators — the platform routes
            you to the right workspace automatically.
          </p>
        </div>

        <div className="relative z-10">
          <FraudEngineVisual className="h-auto w-full max-w-lg opacity-90" />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Form pane                                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="mt-3 text-lg font-semibold">InsureGuard</p>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your insurance intelligence workspace.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
          >
            {serverError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
              />

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>

                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="pr-10"
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050505]">
          <ShieldCheck className="h-8 w-8 animate-pulse text-primary" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
