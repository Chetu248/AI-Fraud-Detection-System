import apiClient from "./client";

import type {
  DashboardResponse,
} from "@/types/api";

export const dashboardApi = {
  getSummary: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get(
      "/dashboard/summary"
    );

    return response.data;
  },
};
