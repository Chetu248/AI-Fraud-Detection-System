import type { UserRole } from "@/types/auth";

export function getRoleDashboard(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";

    case "INVESTIGATOR":
      return "/investigator/dashboard";

    case "INSURANCE_AGENT":
      return "/manager/dashboard";

    case "CUSTOMER":
    default:
      return "/customer/dashboard";
  }
}