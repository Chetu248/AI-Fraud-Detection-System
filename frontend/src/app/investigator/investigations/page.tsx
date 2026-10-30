import { InvestigationsListView } from "@/components/investigations/investigations-list-view";

export default function InvestigatorInvestigationsPage() {
  return (
    <InvestigationsListView
      title="Investigations"
      description="Manage fraud investigations and findings."
      detailBasePath="/investigator/investigations"
    />
  );
}
