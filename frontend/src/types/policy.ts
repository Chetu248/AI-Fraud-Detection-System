export interface InsurancePolicyRequest {
  policyNumber: string;
  policyType: string;
  startDate: string;
  endDate: string;
  premiumAmount: number;
  status: string;
  vehicleId: number;
}

export interface InsurancePolicyResponse {
  id: number;
  policyNumber: string;
  policyType: string;
  startDate: string;
  endDate: string;
  premiumAmount: number;
  status: string;
  vehicleId: number;
}