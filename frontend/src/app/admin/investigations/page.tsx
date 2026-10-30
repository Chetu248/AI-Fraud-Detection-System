import { InvestigationsListView } from "@/components/investigations/investigations-list-view";

export default function AdminInvestigationsPage() {
  return (
    <InvestigationsListView
      title="Investigations"
      description="System-wide view of all fraud investigations."
      detailBasePath="/admin/investigations"
    />
  );
}
