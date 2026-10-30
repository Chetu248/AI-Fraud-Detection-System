import apiClient from "./client";
import type { DocumentResponse } from "@/types/document";

export const documentApi = {
  getByClaimId: async (
    claimId: number
  ): Promise<DocumentResponse[]> => {
    const response = await apiClient.get(
      `/claims/${claimId}/documents`
    );

    return response.data;
  },

  upload: async (
    claimId: number,
    file: File
  ): Promise<DocumentResponse> => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await apiClient.post(
      `/claims/${claimId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};