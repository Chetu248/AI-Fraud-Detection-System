export type ClaimStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface ClaimRequest {
  vehicleId: number;
  claimAmount: number;
  description: string;
  claimDate: string;
}

export interface ClaimResponse {
  id: number;
  vehicleId: number;
  claimAmount: number;
  description: string;
  claimDate: string;
  status: ClaimStatus;
}