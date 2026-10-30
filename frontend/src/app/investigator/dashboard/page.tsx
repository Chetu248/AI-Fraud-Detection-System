"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Search,
} from "lucide-react";

import { dashboardApi } from "@/lib/api/dashboard";
import { investigationApi } from "@/lib/api/investigations";
import { claimApi } from "@/lib/api/claims";

import type { DashboardResponse } from "@/types/api";
import type { InvestigationResponse } from "@/types/investigation";
import type { ClaimResponse } from "@/types/claim";

import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const KPI_CARDS = [
  { key: "totalClaims", label: "Total Claims", icon: ClipboardList, accent: "default" as const },
  { key: "underInvestigation", label: "Under Investigation", icon: Search, accent: "info" as const },
  { key: "pendingInvestigations", label: "Pending Investigations", icon: Clock, accent: "warning" as const },
  { key: "completedInvestigations", label: "Completed Investigations", icon: CheckCircle2, accent: "success" as const },
  { key: "unreadNotifications", label: "Unread Notifications", icon: Bell, accent: "default" as const },
];

export default function InvestigatorDashboard() {
  const [summary, setSummary] = useState<DashboardResponse | null>(null);
  const [investigations, setInvestigations] = useState<InvestigationResponse[] | null>(null);
  const [claims, setClaims] = useState<ClaimResponse[] | null>(null);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    async function loadDashboard() {
      setError(false);

      try {
        const [summaryRes, investigationsRes, claimsRes] = await Promise.all([
          dashboardApi.getSummary(),
          investigationApi.getAll(),
          claimApi.getAll(),
        ]);

        setSummary(summaryRes);
        setInvestigations(investigationsRes);
        setClaims(claimsRes);
      } catch {
        setError(true);
      }
    }

    loadDashboard();
  }, [reloadToken]);

  if (error) {
    return <ErrorState onRetry={() => setReloadToken((token) => token + 1)} />;
  }

  const activeQueue = investigations
    ?.filter((item) => item.status === "PENDING" || item.status === "IN_PROGRESS")
    .slice(0, 6);

  const claimsNeedingAttention = claims
    ?.filter((claim) => claim.status === "UNDER_REVIEW")
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Investigator Dashboard"
        description="Monitor claims and manage ongoing investigations."
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Investigation Queue</CardTitle>
            <Link
              href="/investigator/investigations"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>

          <CardContent>
            {!investigations ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : activeQueue && activeQueue.length > 0 ? (
              <ul className="divide-y divide-border">
                {activeQueue.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/investigator/investigations/${item.id}`}
                      className="flex items-center justify-between gap-3 py-3 transition-colors hover:opacity-80"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          Investigation #{item.id} — Claim #{item.claimId}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.reason || "No reason provided"}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={Search}
                title="Queue is Clear"
                description="No pending or in-progress investigations right now."
              />
            )}
          </CardContent>
        </Card>

        <Card className="glow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Claims Requiring Attention</CardTitle>
            <Link
              href="/investigator/claims"
              className="text-sm font-medium text-primary hover:underline"
            >
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
            ) : claimsNeedingAttention && claimsNeedingAttention.length > 0 ? (
              <ul className="divide-y divide-border">
                {claimsNeedingAttention.map((claim) => (
                  <li key={claim.id}>
                    <Link
                      href={`/investigator/claims/${claim.id}`}
                      className="flex items-center justify-between gap-3 py-3 transition-colors hover:opacity-80"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          Claim #{claim.id} — ₹{claim.claimAmount.toLocaleString()}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
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
                title="Nothing Pending Review"
                description="No claims are currently under review."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
