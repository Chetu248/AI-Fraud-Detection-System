"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Search } from "lucide-react";

import { claimApi } from "@/lib/api/claims";
import type { ClaimResponse } from "@/types/claim";

import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ClaimsListViewProps {
  title: string;
  description: string;
  detailBasePath: string;
}

export function ClaimsListView({
  title,
  description,
  detailBasePath,
}: ClaimsListViewProps) {
  const [claims, setClaims] = useState<ClaimResponse[] | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadClaims() {
      setError(false);

      try {
        setClaims(await claimApi.getAll());
      } catch {
        setError(true);
      }
    }

    loadClaims();
  }, []);

  const filteredClaims = claims?.filter((claim) => {
    const value = search.toLowerCase();

    return (
      claim.id.toString().includes(value) ||
      claim.vehicleId.toString().includes(value) ||
      claim.status.toLowerCase().includes(value) ||
      claim.description.toLowerCase().includes(value)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />

      {error ? (
        <ErrorState />
      ) : !claims ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search claims..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredClaims && filteredClaims.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Claims Found"
              description="Try adjusting your search."
            />
          ) : (
            <>
              <Card className="glow-card hidden md:block">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Claim ID</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredClaims?.map((claim) => (
                        <TableRow key={claim.id}>
                          <TableCell className="font-medium">#{claim.id}</TableCell>
                          <TableCell>#{claim.vehicleId}</TableCell>
                          <TableCell>₹{claim.claimAmount.toLocaleString()}</TableCell>
                          <TableCell>
                            {new Date(claim.claimDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={claim.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              href={`${detailBasePath}/${claim.id}`}
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
                {filteredClaims?.map((claim) => (
                  <Link key={claim.id} href={`${detailBasePath}/${claim.id}`}>
                    <Card className="glow-card">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="min-w-0">
                          <p className="font-medium">Claim #{claim.id}</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{claim.claimAmount.toLocaleString()} ·{" "}
                            {new Date(claim.claimDate).toLocaleDateString()}
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
        </>
      )}
    </div>
  );
}
