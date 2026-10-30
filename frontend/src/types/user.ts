import type { UserRole } from "./auth";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  active: boolean;
  emailVerified: boolean;
}

export interface UserProfileRequest {
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface UserProfileResponse {
  id: number;
  userId: number;
  dateOfBirth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
}