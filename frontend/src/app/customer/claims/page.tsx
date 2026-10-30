"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, FileText, Plus } from "lucide-react";

import { claimApi } from "@/lib/api/claims";
import type { ClaimResponse } from "@/types/claim";

import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ClaimsPage() {
  const [claims, setClaims] = useState<ClaimResponse[] | null>(null);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    async function load() {
      setError(false);

      try {
        setClaims(await claimApi.getAll());
      } catch {
        setError(true);
      }
    }

    load();
  }, [reloadToken]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Claims"
        description="Manage your insurance claims."
        actions={
          <Button asChild>
            <Link href="/customer/claims/new">
              <Plus className="mr-2 h-4 w-4" />
              New Claim
            </Link>
          </Button>
        }
      />

      {error ? (
        <ErrorState onRetry={() => setReloadToken((t) => t + 1)} />
      ) : !claims ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : claims.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Claims Yet"
          description="You haven't submitted any claims."
          actionLabel="Submit Your First Claim"
          actionHref="/customer/claims/new"
        />
      ) : (
        <>
          {/* Table — desktop */}
          <Card className="glow-card hidden md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {claims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">#{claim.id}</TableCell>
                      <TableCell>#{claim.vehicleId}</TableCell>
                      <TableCell>₹{claim.claimAmount.toLocaleString()}</TableCell>
                      <TableCell>{claim.claimDate}</TableCell>
                      <TableCell>
                        <StatusBadge status={claim.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/customer/claims/${claim.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Cards — mobile */}
          <div className="space-y-3 md:hidden">
            {claims.map((claim) => (
              <Link key={claim.id} href={`/customer/claims/${claim.id}`}>
                <Card className="glow-card">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0">
                      <p className="font-medium">Claim #{claim.id}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{claim.claimAmount.toLocaleString()} · {claim.claimDate}
                      </p>
                    </div>
                    <StatusBadge status={claim.status} />
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
