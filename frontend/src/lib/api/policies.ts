import apiClient from "./client";

import type {
  InsurancePolicyRequest,
  InsurancePolicyResponse,
} from "@/types/policy";

export const policyApi = {
  getAll: async (): Promise<InsurancePolicyResponse[]> => {
    const response = await apiClient.get("/policies");
    return response.data;
  },

  getById: async (
    id: number
  ): Promise<InsurancePolicyResponse> => {
    const response = await apiClient.get(
      `/policies/${id}`
    );

    return response.data;
  },

  create: async (
    data: InsurancePolicyRequest
  ): Promise<InsurancePolicyResponse> => {
    const response = await apiClient.post(
      "/policies",
      data
    );

    return response.data;
  },

  update: async (
    id: number,
    data: InsurancePolicyRequest
  ): Promise<InsurancePolicyResponse> => {
    const response = await apiClient.put(
      `/policies/${id}`,
      data
    );

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(
      `/policies/${id}`
    );
  },
};
