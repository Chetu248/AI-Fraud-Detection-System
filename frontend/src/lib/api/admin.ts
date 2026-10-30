import apiClient from "./client";

import type {
  AdminResponse,
  AuditLogRequest,
  AuditLogResponse,
} from "@/types/api";

export const adminApi = {
  getOverview: async (): Promise<AdminResponse> => {
    const response = await apiClient.get(
      "/admin/overview"
    );

    return response.data;
  },
};

export const auditApi = {
  getAll: async (): Promise<AuditLogResponse[]> => {
    const response = await apiClient.get(
      "/admin/audit-logs"
    );

    return response.data;
  },

  getById: async (
    id: number
  ): Promise<AuditLogResponse> => {
    const response = await apiClient.get(
      `/admin/audit-logs/${id}`
    );

    return response.data;
  },

  getByUserId: async (
    userId: number
  ): Promise<AuditLogResponse[]> => {
    const response = await apiClient.get(
      `/admin/audit-logs/user/${userId}`
    );

    return response.data;
  },

  getByEntity: async (
    entityType: string,
    entityId: number
  ): Promise<AuditLogResponse[]> => {
    const response = await apiClient.get(
      `/admin/audit-logs/entity/${entityType}/${entityId}`
    );

    return response.data;
  },

  create: async (
    data: AuditLogRequest
  ): Promise<AuditLogResponse> => {
    const response = await apiClient.post(
      "/admin/audit-logs",
      data
    );

    return response.data;
  },
};
