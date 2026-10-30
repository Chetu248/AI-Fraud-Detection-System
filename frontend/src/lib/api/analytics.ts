import apiClient from "./client";

import type {
  AnalyticsResponse,
} from "@/types/api";

export const analyticsApi = {
  getSummary: async (): Promise<AnalyticsResponse> => {
    const response = await apiClient.get(
      "/analytics/summary"
    );

    return response.data;
  },
};
