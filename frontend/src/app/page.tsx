"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  FileSearch,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import { getRoleDashboard } from "@/lib/auth/role-router";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { FraudEngineVisual } from "@/components/branding/fraud-engine-visual";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const hasHydrated = useAuthStore(
    (state) => state.hasHydrated
  );

  useEffect(() => {
    if (hasHydrated && isAuthenticated && user) {
      router.replace(getRoleDashboard(user.role));
    }
  }, [
    hasHydrated,
    isAuthenticated,
    router,
    user,
  ]);

  if (!hasHydrated) {
    return null;
  }

  if (isAuthenticated && user) {
    return null;
  }

  return (
    <main className="app-shell-background min-h-screen">
      {/* ------------------------------------------------------------- */}
      {/* Nav                                                            */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_22px_-4px_var(--brand-glow)]">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <span className="text-lg font-bold tracking-tight">
              InsureGuard
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />

            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>

            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Hero                                                           */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[36rem] bg-grid-fade" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-8 lg:px-8 lg:pb-28 lg:pt-16">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl animate-fade-in-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-accent px-4 py-2 text-sm text-accent-foreground">
                <Sparkles className="h-4 w-4" />
                AI-powered insurance intelligence
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl lg:text-[3.85rem] lg:leading-[1.05]">
                Detect fraud. Investigate smarter. Protect every claim.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                InsureGuard helps insurance teams flag suspicious
                claims, run investigations, and make faster,
                data-driven decisions — all in one connected platform.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">
                    Start Using InsureGuard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Role-aware workflows
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" /> JWT-secured access
                </span>
              </div>
            </div>

            <div className="relative hidden min-h-[320px] lg:block">
              <div className="glass-panel glow-card rounded-2xl p-6 shadow-2xl">
                <FraudEngineVisual className="h-auto w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* Workflow                                                       */}
      {/* ------------------------------------------------------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How it works
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              From claim to decision, without the guesswork
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { step: "01", title: "Claim Submitted", desc: "Customers file a claim with vehicle, incident and document details." },
              { step: "02", title: "Risk Analysis", desc: "The claim is prepared and queued for automated risk assessment." },
              { step: "03", title: "Fraud Detection", desc: "Signals are scored to separate routine claims from risky ones." },
              { step: "04", title: "Investigation", desc: "Flagged claims are routed to an investigator with full context." },
              { step: "05", title: "Decision", desc: "Managers and admins review findings and close the loop." },
            ].map((item, index, arr) => (
              <div key={item.step} className="relative">
                <div className="glow-card h-full rounded-2xl p-5">
                  <span className="text-xs font-semibold text-primary">
                    {item.step}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
                {index < arr.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* Feature grid                                                   */}
      {/* ------------------------------------------------------------- */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Platform
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Built for the complete claims lifecycle
            </h2>

            <p className="mt-4 text-muted-foreground">
              From claim submission to investigation and
              administrative oversight, everything is
              connected in one platform.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={FileSearch}
              title="Claims Management"
              description="Create, track, review, and manage insurance claims through their complete lifecycle."
            />

            <FeatureCard
              icon={BrainCircuit}
              title="Fraud Intelligence"
              description="Prepare claims and investigation data for AI-powered fraud detection and risk analysis."
            />

            <FeatureCard
              icon={Users}
              title="Role-Based Access"
              description="Separate experiences for customers, investigators, managers, and administrators."
            />

            <FeatureCard
              icon={BarChart3}
              title="Investigation Workflow"
              description="Track investigations, findings, statuses, notifications, and audit activity."
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* CTA                                                            */}
      {/* ------------------------------------------------------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="glass-panel flex flex-col items-center justify-between gap-6 rounded-2xl p-8 text-center md:flex-row md:text-left">
            <div>
              <h2 className="text-2xl font-bold">
                Ready to make claims smarter?
              </h2>

              <p className="mt-2 text-muted-foreground">
                Create an account and start using InsureGuard.
              </p>
            </div>

            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} InsureGuard</p>
          <p>AI-powered insurance fraud detection platform</p>
        </div>
      </footer>
    </main>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card className="glow-card h-full">
      <CardHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>

        <CardTitle className="text-lg">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
