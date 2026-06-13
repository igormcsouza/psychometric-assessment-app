import * as React from "react";
import { cn } from "@/lib/utils";

export type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number;
};

export const Progress = ({ className, value, ...props }: ProgressProps) => (
  <div
    className={cn("relative h-3 w-full overflow-hidden rounded-full bg-muted", className)}
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={100}
    {...props}
  >
    <div
      className="h-full rounded-full bg-gradient-to-r from-primary via-sky-500 to-cyan-500 transition-all"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

