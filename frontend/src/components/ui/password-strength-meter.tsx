"use client";

import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
}

function scorePassword(password: string): number {
  if (!password) return 0;

  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return Math.min(score, 4);
}

const LEVELS = [
  { label: "Very weak", className: "bg-destructive" },
  { label: "Weak", className: "bg-warning" },
  { label: "Fair", className: "bg-warning" },
  { label: "Strong", className: "bg-success" },
  { label: "Very strong", className: "bg-success" },
];

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const score = scorePassword(password);
  const level = LEVELS[score];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={cn(
              "h-1.5 flex-1 rounded-full bg-muted transition-colors",
              index < score && level.className
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{level.label}</p>
    </div>
  );
}
