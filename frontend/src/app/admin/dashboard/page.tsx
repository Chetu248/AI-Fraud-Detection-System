"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileWarning,
  Search,
  Users,
} from "lucide-react";

import { adminApi, auditApi } from "@/lib/api/admin";

import type { AdminResponse, AuditLogResponse } from "@/types/api";

import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const KPI_CARDS = [
  { key: "totalClaims", label: "Total Claims", icon: ClipboardList, accent: "default" as const },
  { key: "totalInvestigations", label: "Total Investigations", icon: FileWarning, accent: "info" as const },
  { key: "pendingInvestigations", label: "Pending Investigations", icon: Clock, accent: "warning" as const },
  { key: "completedInvestigations", label: "Completed Investigations", icon: CheckCircle2, accent: "success" as const },
  { key: "totalNotifications", label: "Total Notifications", icon: Bell, accent: "default" as const },
  { key: "unreadNotifications", label: "Unread Notifications", icon: Bell, accent: "default" as const },
];

const QUICK_LINKS = [
  { href: "/admin/users", icon: Users, title: "User Management", description: "Manage platform users and roles." },
  { href: "/admin/investigations", icon: Search, title: "Fraud Investigations", description: "Monitor investigation activity." },
  { href: "/admin/audit-logs", icon: FileWarning, title: "Audit Trail", description: "Review system activity." },
];

export default function AdminDashboard() {
  const [summary, setSummary] = useState<AdminResponse | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogResponse[] | null>(null);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    async function loadDashboard() {
      setError(false);

      try {
        const [overview, logs] = await Promise.all([
          adminApi.getOverview(),
          auditApi.getAll(),
        ]);

        setSummary(overview);
        setAuditLogs(logs);
      } catch {
        setError(true);
      }
    }

    loadDashboard();
  }, [reloadToken]);

  if (error) {
    return <ErrorState onRetry={() => setReloadToken((token) => token + 1)} />;
  }

  const recentLogs = auditLogs
    ?.slice()
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description="System-wide insurance fraud detection overview."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KPI_CARDS.map((card) => (
          <MetricCard
            key={card.key}
            label={card.label}
            icon={card.icon}
            accent={card.accent}
            loading={!summary}
            value={summary?.[card.key as keyof AdminResponse]}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="glow-card flex items-start gap-3 rounded-2xl p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <link.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{link.title}</p>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <Card className="glow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent System Activity</CardTitle>
          <Link href="/admin/audit-logs" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </CardHeader>

        <CardContent>
          {!auditLogs ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : recentLogs && recentLogs.length > 0 ? (
            <ul className="divide-y divide-border">
              {recentLogs.map((log) => (
                <li key={log.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {log.entityType}
                      {log.entityId != null ? ` #${log.entityId}` : ""}
                      {log.description ? ` — ${log.description}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">{log.action}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={FileWarning}
              title="No Activity Yet"
              description="System activity will appear here as it happens."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
