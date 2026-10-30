"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";
import { getRoleDashboard } from "@/lib/auth/role-router";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace(
        `/auth/login?redirect=${encodeURIComponent(pathname)}`
      );
      return;
    }

    if (
      allowedRoles &&
      !allowedRoles.includes(user.role)
    ) {
      router.replace(getRoleDashboard(user.role));
    }
  }, [
    isAuthenticated,
    user,
    allowedRoles,
    pathname,
    router,
  ]);

  if (!isAuthenticated || !user) {
    return null;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}