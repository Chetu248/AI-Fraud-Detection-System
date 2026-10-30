"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Car,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Search,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import { getRoleLabel } from "@/lib/roles";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}

const customerNavigation: NavigationItem[] = [
  { title: "Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
  { title: "Claims", href: "/customer/claims", icon: FileText },
  { title: "Vehicles", href: "/customer/vehicles", icon: Car },
  { title: "Policies", href: "/customer/policies", icon: ClipboardList },
  { title: "Notifications", href: "/shared/notifications", icon: Bell },
  { title: "Profile", href: "/shared/profile", icon: User },
];

const investigatorNavigation: NavigationItem[] = [
  { title: "Dashboard", href: "/investigator/dashboard", icon: LayoutDashboard },
  { title: "Investigations", href: "/investigator/investigations", icon: Search },
  { title: "Claims", href: "/investigator/claims", icon: FileText },
  { title: "Notifications", href: "/shared/notifications", icon: Bell },
  { title: "Profile", href: "/shared/profile", icon: User },
];

const managerNavigation: NavigationItem[] = [
  { title: "Dashboard", href: "/manager/dashboard", icon: LayoutDashboard },
  { title: "Claims", href: "/manager/claims", icon: FileText },
  { title: "Investigations", href: "/manager/investigations", icon: Search },
  { title: "Analytics", href: "/manager/analytics", icon: BarChart3 },
  { title: "Notifications", href: "/shared/notifications", icon: Bell },
  { title: "Profile", href: "/shared/profile", icon: User },
];

const adminNavigation: NavigationItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Claims", href: "/admin/claims", icon: FileText },
  { title: "Investigations", href: "/admin/investigations", icon: Search },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
  { title: "Notifications", href: "/shared/notifications", icon: Bell },
  { title: "Profile", href: "/shared/profile", icon: User },
];

function getNavigation(role?: string): NavigationItem[] {
  switch (role) {
    case "ADMIN":
      return adminNavigation;

    case "INVESTIGATOR":
      return investigatorNavigation;

    case "INSURANCE_AGENT":
      return managerNavigation;

    case "CUSTOMER":
    default:
      return customerNavigation;
  }
}

function SidebarContent({
  onClose,
  collapsed = false,
}: {
  onClose?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();

  const user = useAuthStore(
    (state) => state.user
  );

  const navigation = getNavigation(user?.role);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div
        className={cn(
          "flex h-16 items-center border-b border-white/10",
          collapsed ? "justify-center px-2" : "px-5"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_18px_-4px_var(--brand-glow)]">
            <ShieldCheck className="h-5 w-5" />
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm font-semibold tracking-tight">
                InsureGuard
              </p>

              <p className="text-xs text-sidebar-foreground/60">
                {getRoleLabel(user?.role)}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ml-auto rounded-md p-1 text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground md:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto p-3"
        aria-label="Primary navigation"
      >
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          const link = (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-white/10 text-sidebar-foreground"
                  : "text-sidebar-foreground/65 hover:bg-white/5 hover:text-sidebar-foreground"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
              )}

              <Icon className="h-4 w-4 shrink-0" />

              {!collapsed && <span>{item.title}</span>}
            </Link>
          );

          if (!collapsed) {
            return link;
          }

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger render={link} />
              <TooltipContent side="right">{item.title}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user?.email || "User"}
              </p>

              <p className="text-xs text-sidebar-foreground/60">
                {getRoleLabel(user?.role)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  open = false,
  onClose,
  collapsed = false,
  onToggleCollapsed,
}: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-white/10 bg-sidebar transition-[width] duration-200 md:block",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-hidden">
            <SidebarContent collapsed={collapsed} />
          </div>

          {onToggleCollapsed && (
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-pressed={collapsed}
              className={cn(
                "flex h-11 shrink-0 items-center gap-2 border-t border-white/10 text-sm font-medium text-sidebar-foreground/65 hover:bg-white/5 hover:text-sidebar-foreground",
                collapsed ? "justify-center px-0" : "px-5"
              )}
            >
              {collapsed ? (
                <ChevronsRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronsLeft className="h-4 w-4" />
                  Collapse
                </>
              )}
            </button>
          )}
        </div>
      </aside>

      <Sheet
        open={open}
        onOpenChange={(value) => {
          if (!value) {
            onClose?.();
          }
        }}
      >
        <SheetContent
          side="left"
          className="w-72 border-white/10 bg-sidebar p-0 text-sidebar-foreground"
        >
          <SidebarContent onClose={onClose} />
        </SheetContent>
      </Sheet>
    </>
  );
}
