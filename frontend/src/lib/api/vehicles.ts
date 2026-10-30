import apiClient from "./client";

import type {
  VehicleRequest,
  VehicleResponse,
} from "@/types/vehicle";

export const vehicleApi = {
  getAll: async (): Promise<VehicleResponse[]> => {
    const response = await apiClient.get("/vehicles");
    return response.data;
  },

  getById: async (
    id: number
  ): Promise<VehicleResponse> => {
    const response = await apiClient.get(
      `/vehicles/${id}`
    );

    return response.data;
  },

  create: async (
    data: VehicleRequest
  ): Promise<VehicleResponse> => {
    const response = await apiClient.post(
      "/vehicles",
      data
    );

    return response.data;
  },

  update: async (
    id: number,
    data: VehicleRequest
  ): Promise<VehicleResponse> => {
    const response = await apiClient.put(
      `/vehicles/${id}`,
      data
    );

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(
      `/vehicles/${id}`
    );
  },
};
