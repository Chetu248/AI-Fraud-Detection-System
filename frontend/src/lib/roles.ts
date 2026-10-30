import type { UserRole } from "@/types/auth";

/**
 * Backend roles are exactly CUSTOMER | INVESTIGATOR | INSURANCE_AGENT | ADMIN.
 * There is no backend "MANAGER" role — INSURANCE_AGENT is presented to users
 * as "Manager" everywhere in the UI while the app continues to send/receive
 * "INSURANCE_AGENT" on the wire. Never introduce a new backend role here.
 */
export const ROLE_DISPLAY_LABEL: Record<UserRole, string> = {
  ADMIN: "Administrator",
  INVESTIGATOR: "Investigator",
  INSURANCE_AGENT: "Manager",
  CUSTOMER: "Customer",
};

export function getRoleLabel(role?: UserRole | string | null): string {
  if (!role) {
    return "User";
  }

  return ROLE_DISPLAY_LABEL[role as UserRole] ?? "User";
}
