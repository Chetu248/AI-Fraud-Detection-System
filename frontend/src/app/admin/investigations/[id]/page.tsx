"use client";

import { useParams } from "next/navigation";

import { InvestigationDetailView } from "@/components/investigations/investigation-detail-view";

export default function AdminInvestigationDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <InvestigationDetailView
      investigationId={id}
      backHref="/admin/investigations"
      description="System-wide investigation record and findings."
    />
  );
}
