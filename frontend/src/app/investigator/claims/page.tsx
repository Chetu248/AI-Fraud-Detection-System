import { ClaimsListView } from "@/components/claims/claims-list-view";

export default function InvestigatorClaimsPage() {
  return (
    <ClaimsListView
      title="Claims"
      description="Review claims requiring investigation."
      detailBasePath="/investigator/claims"
    />
  );
}
