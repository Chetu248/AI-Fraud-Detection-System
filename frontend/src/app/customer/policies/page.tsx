"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, Eye, Plus } from "lucide-react";

import { policyApi } from "@/lib/api/policies";
import type { InsurancePolicyResponse } from "@/types/policy";

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

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<InsurancePolicyResponse[] | null>(null);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    async function load() {
      setError(false);

      try {
        setPolicies(await policyApi.getAll());
      } catch {
        setError(true);
      }
    }

    load();
  }, [reloadToken]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Policies"
        description="Manage your insurance policies."
        actions={
          <Button asChild>
            <Link href="/customer/policies/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Policy
            </Link>
          </Button>
        }
      />

      {error ? (
        <ErrorState onRetry={() => setReloadToken((t) => t + 1)} />
      ) : !policies ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : policies.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No Policies Yet"
          description="Add an insurance policy to link it with your vehicles."
          actionLabel="Add Your First Policy"
          actionHref="/customer/policies/new"
        />
      ) : (
        <>
          <Card className="glow-card hidden md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Premium</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {policies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">
                        {policy.policyNumber}
                      </TableCell>
                      <TableCell>{policy.policyType}</TableCell>
                      <TableCell>₹{policy.premiumAmount.toLocaleString()}</TableCell>
                      <TableCell>{policy.startDate}</TableCell>
                      <TableCell>{policy.endDate}</TableCell>
                      <TableCell>
                        <StatusBadge status={policy.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/customer/policies/${policy.id}`}>
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

          <div className="space-y-3 md:hidden">
            {policies.map((policy) => (
              <Link key={policy.id} href={`/customer/policies/${policy.id}`}>
                <Card className="glow-card">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0">
                      <p className="font-medium">{policy.policyNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{policy.premiumAmount.toLocaleString()} · {policy.endDate}
                      </p>
                    </div>
                    <StatusBadge status={policy.status} />
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
