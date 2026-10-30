"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock,
  Search,
} from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { dashboardApi } from "@/lib/api/dashboard";

import type { DashboardResponse } from "@/types/api";

import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const KPI_CARDS = [
  { key: "totalClaims", label: "Total Claims", icon: ClipboardList, accent: "default" as const },
  { key: "pendingClaims", label: "Pending Claims", icon: Clock, accent: "warning" as const },
  { key: "approvedClaims", label: "Approved Claims", icon: CheckCircle2, accent: "success" as const },
  { key: "rejectedClaims", label: "Rejected Claims", icon: AlertTriangle, accent: "destructive" as const },
  { key: "totalInvestigations", label: "Total Investigations", icon: Search, accent: "info" as const },
  { key: "completedInvestigations", label: "Completed Investigations", icon: CheckCircle2, accent: "success" as const },
  { key: "unreadNotifications", label: "Unread Notifications", icon: Bell, accent: "default" as const },
];

const CLAIM_STATUS_COLORS = [
  "var(--warning)",
  "var(--success)",
  "var(--destructive)",
  "var(--info)",
];

const INVESTIGATION_STATUS_COLORS = ["var(--warning)", "var(--success)"];

export default function ManagerDashboard() {
  const [summary, setSummary] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    async function loadDashboard() {
      setError(false);

      try {
        const summaryRes = await dashboardApi.getSummary();
        setSummary(summaryRes);
      } catch {
        setError(true);
      }
    }

    loadDashboard();
  }, [reloadToken]);

  if (error) {
    return <ErrorState onRetry={() => setReloadToken((token) => token + 1)} />;
  }

  const claimStatusData = summary
    ? [
        { name: "Pending", value: summary.pendingClaims },
        { name: "Approved", value: summary.approvedClaims },
        { name: "Rejected", value: summary.rejectedClaims },
        { name: "Under Investigation", value: summary.underInvestigation },
      ].filter((entry) => entry.value > 0)
    : [];

  const investigationStatusData = summary
    ? [
        { name: "Pending", value: summary.pendingInvestigations },
        { name: "Completed", value: summary.completedInvestigations },
      ].filter((entry) => entry.value > 0)
    : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manager Dashboard"
        description="Monitor claims, investigation workload, and operational activity."
        actions={
          <Button variant="outline" asChild>
            <Link href="/manager/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Full Analytics
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <CardHeader>
            <CardTitle>Claim Status Distribution</CardTitle>
          </CardHeader>

          <CardContent>
            {!summary ? (
              <Skeleton className="h-64 w-full" />
            ) : claimStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={claimStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {claimStatusData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CLAIM_STATUS_COLORS[index % CLAIM_STATUS_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No claim data available yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="glow-card">
          <CardHeader>
            <CardTitle>Investigation Status Distribution</CardTitle>
          </CardHeader>

          <CardContent>
            {!summary ? (
              <Skeleton className="h-64 w-full" />
            ) : investigationStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={investigationStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {investigationStatusData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={INVESTIGATION_STATUS_COLORS[index % INVESTIGATION_STATUS_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No investigation data available yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
