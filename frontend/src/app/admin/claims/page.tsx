import { ClaimsListView } from "@/components/claims/claims-list-view";

export default function AdminClaimsPage() {
  return (
    <ClaimsListView
      title="Claims"
      description="System-wide view of all insurance claims."
      detailBasePath="/admin/claims"
    />
  );
}
