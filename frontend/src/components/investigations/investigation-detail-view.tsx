"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Search } from "lucide-react";

import { investigationApi } from "@/lib/api/investigations";
import type {
  InvestigationResponse,
  InvestigationStatus,
} from "@/types/investigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvestigationDetailViewProps {
  investigationId: number;
  backHref: string;
  description: string;
}

export function InvestigationDetailView({
  investigationId,
  backHref,
  description,
}: InvestigationDetailViewProps) {
  const router = useRouter();

  const [investigation, setInvestigation] =
    useState<InvestigationResponse | null>(null);
  const [status, setStatus] = useState<InvestigationStatus>("PENDING");
  const [findings, setFindings] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!investigationId || Number.isNaN(investigationId)) return;

    async function load() {
      try {
        const data = await investigationApi.getById(investigationId);
        setInvestigation(data);
        setStatus(data.status);
        setFindings(data.findings ?? "");
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [investigationId]);

  const handleSave = async () => {
    setSaving(true);

    try {
      const updated = await investigationApi.update(investigationId, {
        claimId: investigation!.claimId,
        reason: investigation?.reason ?? undefined,
        findings,
        status,
        investigator: investigation?.investigator ?? undefined,
      });

      setInvestigation(updated);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (notFound || !investigation) {
    return (
      <div className="max-w-4xl space-y-6">
        <Button variant="ghost" onClick={() => router.push(backHref)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Investigations
        </Button>

        <EmptyState
          icon={Search}
          title="Investigation Not Found"
          description="The requested investigation could not be found."
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Button variant="ghost" onClick={() => router.push(backHref)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Investigations
      </Button>

      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Investigation #{investigation.id}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <StatusBadge status={investigation.status} className="ml-auto" />
      </div>

      <Card className="glow-card">
        <CardHeader>
          <CardTitle>Investigation Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Claim ID" value={`#${investigation.claimId}`} />
            <Field
              label="Investigator"
              value={investigation.investigator ?? "Unassigned"}
            />
            <Field
              label="Started"
              value={
                investigation.startedAt
                  ? new Date(investigation.startedAt).toLocaleString()
                  : "Not started"
              }
            />
            <Field
              label="Completed"
              value={
                investigation.completedAt
                  ? new Date(investigation.completedAt).toLocaleString()
                  : "Not completed"
              }
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">Reason</p>
            <div className="rounded-lg border border-border p-4 text-sm">
              {investigation.reason ?? "No reason provided."}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glow-card">
        <CardHeader>
          <CardTitle>Findings &amp; Status</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Findings</p>
            <Textarea
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              placeholder="Record investigation findings..."
              rows={5}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as InvestigationStatus)}
            >
              <SelectTrigger className="sm:w-[220px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
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
