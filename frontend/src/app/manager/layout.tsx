"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { AppLayout } from "@/components/layout/app-layout";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["INSURANCE_AGENT"]}>
      <AppLayout>
        {children}
      </AppLayout>
    </RouteGuard>
  );
}
