"use client";

import { useParams } from "next/navigation";

import { InvestigationDetailView } from "@/components/investigations/investigation-detail-view";

export default function ManagerInvestigationDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <InvestigationDetailView
      investigationId={id}
      backHref="/manager/investigations"
      description="Review investigation progress and findings."
    />
  );
}
