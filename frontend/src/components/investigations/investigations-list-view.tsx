"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { investigationApi } from "@/lib/api/investigations";
import type { InvestigationResponse } from "@/types/investigation";

import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InvestigationsListViewProps {
  title: string;
  description: string;
  detailBasePath: string;
}

export function InvestigationsListView({
  title,
  description,
  detailBasePath,
}: InvestigationsListViewProps) {
  const [investigations, setInvestigations] = useState<
    InvestigationResponse[] | null
  >(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      setError(false);

      try {
        setInvestigations(await investigationApi.getAll());
      } catch {
        setError(true);
      }
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />

      {error ? (
        <ErrorState />
      ) : !investigations ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : investigations.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Investigations Found"
          description="Investigations will appear here once created."
        />
      ) : (
        <>
          <Card className="glow-card hidden md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Claim</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Investigator</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {investigations.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">#{item.id}</TableCell>
                      <TableCell>#{item.claimId}</TableCell>
                      <TableCell className="max-w-[220px] truncate">
                        {item.reason ?? "—"}
                      </TableCell>
                      <TableCell>{item.investigator ?? "Unassigned"}</TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`${detailBasePath}/${item.id}`}
                          className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-3 md:hidden">
            {investigations.map((item) => (
              <Link key={item.id} href={`${detailBasePath}/${item.id}`}>
                <Card className="glow-card">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0">
                      <p className="font-medium">
                        Investigation #{item.id} — Claim #{item.claimId}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {item.investigator ?? "Unassigned"}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
