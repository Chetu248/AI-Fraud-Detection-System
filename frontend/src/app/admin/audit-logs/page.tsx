"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Search } from "lucide-react";

import { auditApi } from "@/lib/api/admin";
import { getApiErrorMessage } from "@/lib/api/error";

import type { AuditLogResponse } from "@/types/api";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ACTION_STYLES: Record<string, string> = {
  CREATE: "border-success/30 bg-success/10 text-success",
  DELETE: "border-destructive/30 bg-destructive/10 text-destructive",
  UPDATE: "border-info/30 bg-info/10 text-info",
  STATUS_CHANGED: "border-info/30 bg-info/10 text-info",
  READ: "border-border bg-muted text-muted-foreground",
};

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return logs;
    }

    return logs.filter(
      (log) =>
        log.action?.toLowerCase().includes(query) ||
        log.entityType?.toLowerCase().includes(query) ||
        log.description?.toLowerCase().includes(query) ||
        String(log.entityId || "").includes(query) ||
        String(log.userId || "").includes(query)
    );
  }, [search, logs]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await auditApi.getAll();
      setLogs(data);
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "Failed to load audit logs."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLogs();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track important activities across the platform."
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search audit logs..."
          className="pl-9"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No Audit Logs Found"
          description="No activity matches your search."
        />
      ) : (
        <Card className="glow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={ACTION_STYLES[log.action] ?? ""}
                      >
                        {log.action.replaceAll("_", " ")}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-medium">
                      {log.entityType}
                    </TableCell>

                    <TableCell className="text-sm">
                      {log.entityId ? `#${log.entityId}` : "—"}
                    </TableCell>

                    <TableCell className="text-sm">
                      {log.userId ? `#${log.userId}` : "—"}
                    </TableCell>

                    <TableCell className="max-w-[300px] text-sm text-muted-foreground">
                      {log.description || "—"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
