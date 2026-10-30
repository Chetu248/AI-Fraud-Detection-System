"use client";

import { useState } from "react";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppLayoutProps {
  children: React.ReactNode;
}

const COLLAPSE_STORAGE_KEY = "insureguard-sidebar-collapsed";

export function AppLayout({
  children,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === "true";
  });

  const toggleCollapsed = () => {
    setCollapsed((previous) => {
      const next = !previous;
      window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <div className="app-shell-background min-h-screen">
      <Navbar
        onMenuClick={() =>
          setSidebarOpen((previous) => !previous)
        }
      />

      <TooltipProvider>
        <div className="flex">
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            collapsed={collapsed}
            onToggleCollapsed={toggleCollapsed}
          />

          <main className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-[1600px] p-4 md:p-7 lg:p-9">
              {children}
            </div>
          </main>
        </div>
      </TooltipProvider>
    </div>
  );
}
