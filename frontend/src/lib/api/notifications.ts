import apiClient from "./client";

import type {
  NotificationRequest,
  NotificationResponse,
} from "@/types/notification";

export const notificationApi = {
  getAll: async (): Promise<NotificationResponse[]> => {
    const response = await apiClient.get("/notifications");
    return response.data;
  },

  getById: async (
    id: number
  ): Promise<NotificationResponse> => {
    const response = await apiClient.get(
      `/notifications/${id}`
    );

    return response.data;
  },

  create: async (
    data: NotificationRequest
  ): Promise<NotificationResponse> => {
    const response = await apiClient.post(
      "/notifications",
      data
    );

    return response.data;
  },

  markAsRead: async (
    id: number
  ): Promise<NotificationResponse> => {
    const response = await apiClient.put(
      `/notifications/${id}/read`
    );

    return response.data;
  },
};
