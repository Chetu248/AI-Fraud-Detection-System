"use client";

import { useParams } from "next/navigation";
import { Check, X } from "lucide-react";

import { ClaimDetailView } from "@/components/claims/claim-detail-view";
import { Button } from "@/components/ui/button";

export default function ManagerClaimDetailsPage() {
  const params = useParams();
  const claimId = Number(params.id);

  return (
    <ClaimDetailView
      claimId={claimId}
      description="Review claim information and supporting documents."
      renderActions={(claim, onStatusChange, updating) => {
        if (claim.status !== "PENDING" && claim.status !== "UNDER_REVIEW") {
          return null;
        }

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-success"
              disabled={updating}
              onClick={() => onStatusChange("APPROVED")}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive"
              disabled={updating}
              onClick={() => onStatusChange("REJECTED")}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        );
      }}
    />
  );
}
