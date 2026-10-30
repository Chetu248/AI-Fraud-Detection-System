"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  KeyRound,
  LogOut,
  Menu,
  ShieldCheck,
  User,
} from "lucide-react";

import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth-store";
import { getRoleLabel } from "@/lib/roles";
import { ThemeToggle } from "@/components/theme/theme-toggle";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({
  onMenuClick,
}: NavbarProps) {
  const router = useRouter();

  const user = useAuthStore(
    (state) => state.user
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Logout locally even if backend logout fails.
    } finally {
      logout();
      router.replace("/auth/login");
    }
  };

  const getInitials = () => {
    if (!user?.email) {
      return "U";
    }

    return user.email
      .split("@")[0]
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_18px_-4px_var(--brand-glow)]">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <span className="hidden tracking-tight sm:inline">
            InsureGuard
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2">
        <ThemeToggle />

        <Button
          variant="ghost"
          size="icon"
          asChild
          className="relative"
        >
          <Link href="/shared/notifications">
            <Bell className="h-5 w-5" />

            <span className="sr-only">
              Notifications
            </span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2"
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              <div className="hidden text-left md:block">
                <p className="max-w-[180px] truncate text-sm font-medium">
                  {user?.email}
                </p>

                <p className="text-xs text-muted-foreground">
                  {getRoleLabel(user?.role)}
                </p>
              </div>

              <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56"
          >
            <DropdownMenuItem asChild>
              <Link href="/shared/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/shared/change-password">
                <KeyRound className="mr-2 h-4 w-4" />
                Change Password
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
