"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  FileWarning,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { analyticsApi } from "@/lib/api/analytics";
import type { AnalyticsResponse } from "@/types/api";

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

interface AnalyticsViewProps {
  title: string;
  description: string;
}

export function AnalyticsView({ title, description }: AnalyticsViewProps) {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    async function load() {
      setError(false);

      try {
        setData(await analyticsApi.getSummary());
      } catch {
        setError(true);
      }
    }

    load();
  }, [reloadToken]);

  if (error) {
    return <ErrorState onRetry={() => setReloadToken((t) => t + 1)} />;
  }

  const claimData = data
    ? [
        { name: "Pending", value: data.pendingClaims },
        { name: "Approved", value: data.approvedClaims },
        { name: "Rejected", value: data.rejectedClaims },
      ]
    : [];

  const investigationData = data
    ? [
        { name: "Pending", value: data.pendingInvestigations },
        { name: "In Progress", value: data.inProgressInvestigations },
        { name: "Completed", value: data.completedInvestigations },
      ]
    : [];

  return (
    <div className="space-y-8">
      <PageHeader title={title} description={description} />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Total Claims"
          icon={BarChart3}
          loading={!data}
          value={data?.totalClaims}
        />
        <MetricCard
          label="Total Investigations"
          icon={FileWarning}
          accent="info"
          loading={!data}
          value={data?.totalInvestigations}
        />
        <MetricCard
          label="Completed Investigations"
          icon={CheckCircle2}
          accent="success"
          loading={!data}
          value={data?.completedInvestigations}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glow-card">
          <CardHeader>
            <CardTitle>Claim Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {!data ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={claimData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--popover-foreground)",
                    }}
                  />
                  <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="glow-card">
          <CardHeader>
            <CardTitle>Investigation Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {!data ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={investigationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--popover-foreground)",
                    }}
                  />
                  <Bar dataKey="value" fill="var(--brand-cyan)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
