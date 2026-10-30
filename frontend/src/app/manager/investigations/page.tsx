import { InvestigationsListView } from "@/components/investigations/investigations-list-view";

export default function ManagerInvestigationsPage() {
  return (
    <InvestigationsListView
      title="Investigations"
      description="Monitor fraud investigations across your team."
      detailBasePath="/manager/investigations"
    />
  );
}
