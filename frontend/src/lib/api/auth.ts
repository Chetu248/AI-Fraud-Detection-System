import apiClient from "./client";

import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
} from "@/types/auth";

export const authApi = {
  login: async (
    data: LoginRequest
  ): Promise<LoginResponse> => {
    const response = await apiClient.post(
      "/auth/login",
      data
    );

    return response.data;
  },

  register: async (
    data: RegisterRequest
  ): Promise<RegisterResponse> => {
    const response = await apiClient.post(
      "/auth/register",
      data
    );

    return response.data;
  },

  refresh: async (
    data: RefreshTokenRequest
  ): Promise<LoginResponse> => {
    const response = await apiClient.post(
      "/auth/refresh",
      data
    );

    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<void> => {
    await apiClient.post(
      "/auth/change-password",
      data
    );
  },

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<void> => {
    await apiClient.post(
      "/auth/forget-password",
      data
    );
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<void> => {
    await apiClient.post(
      "/auth/reset-password",
      data
    );
  },
};
