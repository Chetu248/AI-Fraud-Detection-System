import { ClaimsListView } from "@/components/claims/claims-list-view";

export default function ManagerClaimsPage() {
  return (
    <ClaimsListView
      title="Claims"
      description="Monitor claims across the organization."
      detailBasePath="/manager/claims"
    />
  );
}
