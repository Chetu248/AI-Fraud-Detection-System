import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Every status string used across claims, investigations, notifications,
 * and admin user status. Centralizing the color mapping here means every
 * page shows PENDING / APPROVED / etc. in the same color, instead of each
 * page inventing its own badge classes.
 */
const STATUS_STYLES: Record<string, string> = {
  // Claims
  PENDING: "border-warning/30 bg-warning/10 text-warning",
  UNDER_REVIEW: "border-info/30 bg-info/10 text-info",
  APPROVED: "border-success/30 bg-success/10 text-success",
  REJECTED: "border-destructive/30 bg-destructive/10 text-destructive",

  // Investigations
  IN_PROGRESS: "border-info/30 bg-info/10 text-info",
  COMPLETED: "border-success/30 bg-success/10 text-success",

  // Notifications
  UNREAD: "border-primary/30 bg-primary/10 text-primary",
  READ: "border-border bg-muted text-muted-foreground",

  // Generic active/inactive (users)
  ACTIVE: "border-success/30 bg-success/10 text-success",
  INACTIVE: "border-border bg-muted text-muted-foreground",
};

function toLabel(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "border-border bg-muted text-muted-foreground";

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", style, className)}
    >
      {toLabel(status)}
    </Badge>
  );
}
