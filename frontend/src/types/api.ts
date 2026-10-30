export interface DashboardResponse {
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  underInvestigation: number;
  totalInvestigations: number;
  completedInvestigations: number;
  pendingInvestigations: number;
  totalNotifications: number;
  unreadNotifications: number;
}

export interface AdminResponse {
  totalClaims: number;
  totalInvestigations: number;
  pendingInvestigations: number;
  completedInvestigations: number;
  totalNotifications: number;
  unreadNotifications: number;
}

export interface AnalyticsResponse {
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  totalInvestigations: number;
  pendingInvestigations: number;
  inProgressInvestigations: number;
  completedInvestigations: number;
}

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "READ"
  | "STATUS_CHANGED";

export interface AuditLogRequest {
  action: AuditAction;
  entityType: string;
  entityId?: number;
  userId?: number;
  description?: string;
}

export interface AuditLogResponse {
  id: number;
  action: AuditAction;
  entityType: string;
  entityId: number | null;
  userId: number | null;
  description: string | null;
  timestamp: string;
}