import apiClient from "./client";

import type {
  InvestigationRequest,
  InvestigationResponse,
} from "@/types/investigation";

export const investigationApi = {
  getAll: async (): Promise<InvestigationResponse[]> => {
    const response = await apiClient.get("/investigation");
    return response.data;
  },

  getById: async (
    id: number
  ): Promise<InvestigationResponse> => {
    const response = await apiClient.get(
      `/investigation/${id}`
    );

    return response.data;
  },

  create: async (
    data: InvestigationRequest
  ): Promise<InvestigationResponse> => {
    const response = await apiClient.post(
      "/investigation",
      data
    );

    return response.data;
  },

  update: async (
    id: number,
    data: InvestigationRequest
  ): Promise<InvestigationResponse> => {
    const response = await apiClient.put(
      `/investigation/${id}`,
      data
    );

    return response.data;
  },

  updateStatus: async (
    id: number,
    status: InvestigationRequest["status"]
  ): Promise<InvestigationResponse> => {
    const current = await investigationApi.getById(id);
    const response = await apiClient.put(`/investigation/${id}`, {
      claimId: current.claimId,
      status,
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(
      `/investigation/${id}`
    );
  },
};
