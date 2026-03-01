import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  topLeft?: ReactNode;
  topRight?: ReactNode;
  children?: ReactNode;
  className?: string;
  topRowClassName?: string;
  contentClassName?: string;
}

export function PageHeader({
  topLeft,
  topRight,
  children,
  className,
  topRowClassName,
  contentClassName,
}: PageHeaderProps) {
  const hasTopRow = Boolean(topLeft || topRight);

  return (
    <header className={className}>
      {hasTopRow && (
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-3",
            topRowClassName
          )}
        >
          <div className="flex min-h-9 items-center gap-2">{topLeft}</div>
          <div className="flex items-center gap-2">{topRight}</div>
        </div>
      )}

      {children && (
        <div className={cn(hasTopRow && "mt-4", contentClassName)}>
          {children}
        </div>
      )}
    </header>
  );
}
