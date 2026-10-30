export type NotificationStatus = "UNREAD" | "READ";

export type NotificationType =
  | "CLAIM_CREATED"
  | "CLAIM_STATUS_CHANGED"
  | "INVESTIGATION_STARTED"
  | "INVESTIGATION_COMPLETED"
  | "FRAUD_DETECTED"
  | "SYSTEM";

export interface NotificationRequest {
  message: string;
  type: NotificationType;
  status?: NotificationStatus;
  userId?: number;
  claimId?: number;
  investigationId?: number;
}

export interface NotificationResponse {
  id: number;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  userId: number | null;
  claimId: number | null;
  investigationId: number | null;
  createdAt: string;
  readAt: string | null;
}