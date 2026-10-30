"use client";

import { useParams } from "next/navigation";

import { InvestigationDetailView } from "@/components/investigations/investigation-detail-view";

export default function InvestigatorInvestigationDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <InvestigationDetailView
      investigationId={id}
      backHref="/investigator/investigations"
      description="Record findings and update investigation status."
    />
  );
}
