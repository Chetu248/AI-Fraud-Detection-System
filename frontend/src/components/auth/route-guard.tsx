"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";
import { getRoleDashboard } from "@/lib/auth/role-router";

import type { UserRole } from "@/types/auth";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function RouteGuard({
  children,
  allowedRoles,
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const hasHydrated = useAuthStore(
    (state) => state.hasHydrated
  );

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace(
        `/auth/login?redirect=${encodeURIComponent(pathname)}`
      );
      return;
    }

    if (
      allowedRoles &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user.role)
    ) {
      router.replace(getRoleDashboard(user.role));
    }
  }, [
    allowedRoles,
    hasHydrated,
    isAuthenticated,
    pathname,
    router,
    user,
  ]);

  if (!hasHydrated) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}
