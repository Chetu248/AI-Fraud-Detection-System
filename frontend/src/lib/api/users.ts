import apiClient from "./client";

import type {
  User,
  UserProfileRequest,
  UserProfileResponse,
} from "@/types/user";

import type { UserRole } from "@/types/auth";

export const userApi = {
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get(
      "/users/profile"
    );

    return response.data;
  },

  updateProfile: async (
    data: UserProfileRequest
  ): Promise<UserProfileResponse> => {
    const response = await apiClient.put(
      "/users/profile",
      data
    );

    return response.data;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get("/users");

    return response.data;
  },

  updateRole: async (
    id: number,
    role: UserRole
  ): Promise<User> => {
    const response = await apiClient.put(
      `/users/${id}/role`,
      { role }
    );

    return response.data;
  },
};
