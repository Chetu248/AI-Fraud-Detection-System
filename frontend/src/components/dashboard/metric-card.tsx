import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: number | string | null | undefined;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  accent?: "default" | "success" | "warning" | "destructive" | "info";
  className?: string;
}

const ACCENT_STYLES: Record<
  NonNullable<MetricCardProps["accent"]>,
  string
> = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  loading = false,
  accent = "default",
  className,
}: MetricCardProps) {
  return (
    <div className={cn("glow-card rounded-2xl p-5", className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>

        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            ACCENT_STYLES[accent]
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3">
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <span className="text-3xl font-semibold tracking-tight">
            {value ?? 0}
          </span>
        )}
      </div>
    </div>
  );
}
