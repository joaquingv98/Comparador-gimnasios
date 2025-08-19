"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  /** clase para la barra interior (color dinámico, etc.) */
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, indicatorClassName, ...props }, ref) => {
    // clamp 0–100 para evitar valores raros
    const v = Math.max(0, Math.min(100, value ?? 0));

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 bg-primary transition-all",
            indicatorClassName
          )}
          style={{ transform: `translateX(-${100 - v}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
