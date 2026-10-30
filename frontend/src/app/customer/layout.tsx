"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { AppLayout } from "@/components/layout/app-layout";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["CUSTOMER"]}>
      <AppLayout>
        {children}
      </AppLayout>
    </RouteGuard>
  );
}
