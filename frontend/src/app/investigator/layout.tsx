"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { AppLayout } from "@/components/layout/app-layout";

export default function InvestigatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["INVESTIGATOR"]}>
      <AppLayout>
        {children}
      </AppLayout>
    </RouteGuard>
  );
}
