"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ClipboardList } from "lucide-react";

import { policyApi } from "@/lib/api/policies";
import type { InsurancePolicyResponse } from "@/types/policy";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function PolicyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [policy, setPolicy] = useState<InsurancePolicyResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    policyApi.getById(id).then(setPolicy).catch(() => setError(true));
  }, [id]);

  if (error) {
    return <ErrorState />;
  }

  if (!policy) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="glow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">{policy.policyNumber}</CardTitle>
                <p className="text-sm text-muted-foreground">{policy.policyType}</p>
              </div>
            </div>

            <StatusBadge status={policy.status} />
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          <Field label="Policy Number" value={policy.policyNumber} />
          <Field label="Vehicle" value={`#${policy.vehicleId}`} />
          <Field label="Premium" value={`₹${policy.premiumAmount.toLocaleString()}`} />
          <Field label="Status" value={policy.status} />
          <Field label="Start Date" value={policy.startDate} />
          <Field label="End Date" value={policy.endDate} />
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
