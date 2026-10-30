export type InvestigationStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED";

export interface InvestigationRequest {
  claimId: number;
  reason?: string;
  findings?: string;
  status?: InvestigationStatus;
  investigator?: string;
}

export interface InvestigationResponse {
  id: number;
  claimId: number;
  reason: string | null;
  findings: string | null;
  status: InvestigationStatus;
  investigator: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}