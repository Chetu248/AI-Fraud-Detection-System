import apiClient from "./client";

import type {
  ClaimRequest,
  ClaimResponse,
  ClaimStatus,
} from "@/types/claim";

export const claimApi = {
  getAll: async (): Promise<ClaimResponse[]> => {
    const response = await apiClient.get("/claims");
    return response.data;
  },

  getById: async (
    id: number
  ): Promise<ClaimResponse> => {
    const response = await apiClient.get(
      `/claims/${id}`
    );

    return response.data;
  },

  create: async (
    data: ClaimRequest
  ): Promise<ClaimResponse> => {
    const response = await apiClient.post(
      "/claims",
      data
    );

    return response.data;
  },

  update: async (
    id: number,
    data: ClaimRequest
  ): Promise<ClaimResponse> => {
    const response = await apiClient.put(
      `/claims/${id}`,
      data
    );

    return response.data;
  },

  updateStatus: async (
    id: number,
    status: ClaimStatus
  ): Promise<ClaimResponse> => {
    const response = await apiClient.put(
      `/claims/${id}/status`,
      { status }
    );

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(
      `/claims/${id}`
    );
  },
};
