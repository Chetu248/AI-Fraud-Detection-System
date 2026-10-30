"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Bell,
  Car,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  Plus,
  ShieldAlert,
} from "lucide-react";

import { dashboardApi } from "@/lib/api/dashboard";
import { claimApi } from "@/lib/api/claims";
import { notificationApi } from "@/lib/api/notifications";
import { vehicleApi } from "@/lib/api/vehicles";
import { policyApi } from "@/lib/api/policies";

import type { DashboardResponse } from "@/types/api";
import type { ClaimResponse } from "@/types/claim";
import type { NotificationResponse } from "@/types/notification";

import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const KPI_CARDS = [
  { key: "totalClaims", label: "Total Claims", icon: FileText, accent: "default" as const },
  { key: "pendingClaims", label: "Pending Claims", icon: Clock3, accent: "warning" as const },
  { key: "approvedClaims", label: "Approved Claims", icon: CheckCircle2, accent: "success" as const },
  { key: "rejectedClaims", label: "Rejected Claims", icon: AlertCircle, accent: "destructive" as const },
  { key: "underInvestigation", label: "Under Investigation", icon: ShieldAlert, accent: "info" as const },
];

export default function CustomerDashboard() {
  const [summary, setSummary] = useState<DashboardResponse | null>(null);
  const [claims, setClaims] = useState<ClaimResponse[] | null>(null);
  const [notifications, setNotifications] = useState<NotificationResponse[] | null>(null);
  const [vehicleCount, setVehicleCount] = useState<number | null>(null);
  const [policyCount, setPolicyCount] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    async function loadDashboard() {
      setError(false);

      try {
        const [summaryRes, claimsRes, notificationsRes, vehiclesRes, policiesRes] =
          await Promise.all([
            dashboardApi.getSummary(),
            claimApi.getAll(),
            notificationApi.getAll(),
            vehicleApi.getAll(),
            policyApi.getAll(),
          ]);

        setSummary(summaryRes);
        setClaims(claimsRes);
        setNotifications(notificationsRes);
        setVehicleCount(vehiclesRes.length);
        setPolicyCount(policiesRes.length);
      } catch {
        setError(true);
      }
    }

    loadDashboard();
  }, [reloadToken]);

  if (error) {
    return <ErrorState onRetry={() => setReloadToken((token) => token + 1)} />;
  }

  const recentClaims = claims
    ?.slice()
    .sort((a, b) => (a.claimDate < b.claimDate ? 1 : -1))
    .slice(0, 5);

  const recentNotifications = notifications?.slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Here's an overview of your insurance activity."
        actions={
          <Button asChild>
            <Link href="/customer/claims/new">
              <Plus className="mr-2 h-4 w-4" />
              Submit Claim
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {KPI_CARDS.map((card) => (
          <MetricCard
            key={card.key}
            label={card.label}
            icon={card.icon}
            accent={card.accent}
            loading={!summary}
            value={summary?.[card.key as keyof DashboardResponse]}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickAction href="/customer/claims/new" icon={Plus} label="Submit Claim" />
        <QuickAction href="/customer/vehicles" icon={Car} label={`My Vehicles${vehicleCount != null ? ` (${vehicleCount})` : ""}`} />
        <QuickAction href="/customer/policies" icon={ClipboardList} label={`My Policies${policyCount != null ? ` (${policyCount})` : ""}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Claims</CardTitle>
            <Link href="/customer/claims" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </CardHeader>

          <CardContent>
            {!claims ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : recentClaims && recentClaims.length > 0 ? (
              <ul className="divide-y divide-border">
                {recentClaims.map((claim) => (
                  <li key={claim.id}>
                    <Link
                      href={`/customer/claims/${claim.id}`}
                      className="flex items-center justify-between gap-3 py-3 transition-colors hover:opacity-80"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          Claim #{claim.id} — ₹{claim.claimAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {claim.claimDate}
                        </p>
                      </div>
                      <StatusBadge status={claim.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={FileText}
                title="No Claims Yet"
                description="You haven't submitted any claims."
                actionLabel="Submit Your First Claim"
                actionHref="/customer/claims/new"
              />
            )}
          </CardContent>
        </Card>

        <Card className="glow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Notifications</CardTitle>
            <Link href="/shared/notifications" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </CardHeader>

          <CardContent>
            {!notifications ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : recentNotifications && recentNotifications.length > 0 ? (
              <ul className="divide-y divide-border">
                {recentNotifications.map((notification) => (
                  <li key={notification.id} className="flex items-start gap-3 py-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {notification.status === "UNREAD" && (
                      <span className="ml-auto mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={Bell}
                title="No Notifications"
                description="You're all caught up — nothing new to see here."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="glow-card flex items-center gap-3 rounded-2xl p-4 text-sm font-medium"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      {label}
    </Link>
  );
}
