"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";

import { claimApi } from "@/lib/api/claims";
import { documentApi } from "@/lib/api/documents";

import type { ClaimResponse, ClaimStatus } from "@/types/claim";
import type { DocumentResponse } from "@/types/document";

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

interface ClaimDetailViewProps {
  claimId: number;
  description: string;
  renderActions?: (
    claim: ClaimResponse,
    onStatusChange: (status: ClaimStatus) => Promise<void>,
    updating: boolean
  ) => React.ReactNode;
}

export function ClaimDetailView({
  claimId,
  description,
  renderActions,
}: ClaimDetailViewProps) {
  const router = useRouter();

  const [claim, setClaim] = useState<ClaimResponse | null>(null);
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (!claimId || Number.isNaN(claimId)) return;

    const loadData = async () => {
      try {
        const [claimData, documentData] = await Promise.all([
          claimApi.getById(claimId),
          documentApi.getByClaimId(claimId),
        ]);

        setClaim(claimData);
        setDocuments(documentData);
      } catch {
        setClaim(null);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [claimId]);

  const handleStatusChange = async (status: ClaimStatus) => {
    setUpdating(true);
    setActionError("");

    try {
      const updated = await claimApi.updateStatus(claimId, status);
      setClaim(updated);
    } catch {
      setActionError("Unable to update claim status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <EmptyState
          icon={FileText}
          title="Claim Not Found"
          description="The requested claim could not be found."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Claim #{claim.id}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <StatusBadge status={claim.status} />
          {renderActions?.(claim, handleStatusChange, updating)}
        </div>
      </div>

      {actionError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      <Card className="glow-card">
        <CardHeader>
          <CardTitle>Claim Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <Field label="Claim ID" value={`#${claim.id}`} />
          <Field label="Vehicle ID" value={`#${claim.vehicleId}`} />
          <Field
            label="Claim Amount"
            value={`₹${claim.claimAmount.toLocaleString("en-IN")}`}
          />
          <Field
            label="Claim Date"
            value={new Date(claim.claimDate).toLocaleDateString("en-IN")}
          />

          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="mt-1 whitespace-pre-wrap">{claim.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="glow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Supporting Documents
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {documents.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Documents Available"
              description="No supporting documents have been uploaded for this claim."
            />
          ) : (
            documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center gap-3 rounded-lg border border-border p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {document.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {document.fileType} · {(document.fileSize / 1024).toFixed(1)} KB
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Uploaded {new Date(document.uploadedAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
