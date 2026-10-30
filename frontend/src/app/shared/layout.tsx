"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { AppLayout } from "@/components/layout/app-layout";

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard
      allowedRoles={[
        "CUSTOMER",
        "INVESTIGATOR",
        "INSURANCE_AGENT",
        "ADMIN",
      ]}
    >
      <AppLayout>{children}</AppLayout>
    </RouteGuard>
  );
}
