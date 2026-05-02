"use client";

import { Fragment, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PLAN_HISTORY_HALF_RANGE_DAYS } from "@/lib/planning-center/schedule-load-constants";
import {
  buildServiceHistoryGroups,
  formatCombinedHistoryPositionLabel,
  getHistoryStatusDotClass,
  toServiceHistoryDate,
} from "@/lib/use-cases/planning-center/people/service-history-display";
import type { ServiceHistoryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ScheduleContextPopoverProps {
  serviceHistory: ServiceHistoryItem[];
  children: ReactNode;
}

export function ScheduleContextPopover({ serviceHistory, children }: ScheduleContextPopoverProps) {
  const historyGroups = [...buildServiceHistoryGroups(serviceHistory)].sort(
    (a, b) =>
      toServiceHistoryDate(a.primary.date).getTime() - toServiceHistoryDate(b.primary.date).getTime()
  );

  const rows = (
    <ul className="inline-grid max-w-full grid-cols-[auto_auto_auto] items-start gap-x-3 gap-y-2 px-3 py-2.5">
      {historyGroups.map(({ dayKey, primary, additionalServices, rehearsals }) => (
        <Fragment key={dayKey}>
          <li className="contents">
            <span
              aria-hidden
              className={cn(
                "mt-1.5 size-1.5 shrink-0 self-start rounded-full",
                getHistoryStatusDotClass(primary.status)
              )}
            />
            <span className="whitespace-nowrap text-sm font-normal tabular-nums text-foreground">
              {formatPopoverHistoryDate(primary)}
            </span>
            <span className="text-sm leading-snug text-muted-foreground">
              {formatCombinedHistoryPositionLabel(primary, additionalServices)}
            </span>
          </li>
          {rehearsals.map((rehearsal) => (
            <li key={rehearsal.id} className="contents">
              <span aria-hidden />
              <span className="-mt-1 whitespace-nowrap text-xs leading-none tabular-nums text-muted-foreground/70">
                {formatPopoverHistoryDate(rehearsal, { includeServiceTypeName: false })} -{" "}
                <span className="text-muted-foreground/50">Rehearsal</span>
              </span>
              <span aria-hidden />
            </li>
          ))}
        </Fragment>
      ))}
    </ul>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="start"
        side="right"
        sideOffset={10}
        collisionPadding={16}
        className="w-auto max-w-[min(44rem,calc(100vw-2rem))] overflow-hidden p-0"
      >
        <div className="border-b border-border/40 px-5 py-3">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            Schedule ±{PLAN_HISTORY_HALF_RANGE_DAYS} days from this service
          </p>
        </div>
        {historyGroups.length === 0 ? (
          <p className="px-5 py-4 text-sm text-muted-foreground">No recent history</p>
        ) : (
          <div className="max-h-[min(40rem,calc(100vh-8rem),calc(var(--radix-popover-content-available-height)-1rem))] overflow-y-auto">
            {rows}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function formatPopoverHistoryDate(
  item: ServiceHistoryItem,
  options: { includeServiceTypeName?: boolean } = {}
) {
  const base = formatServiceHistoryDisplayDateWithoutYear(item.date);
  if (options.includeServiceTypeName === false) return base;
  const serviceTypeName = item.serviceTypeName?.trim();
  return serviceTypeName ? `${base} (${serviceTypeName})` : base;
}

function formatServiceHistoryDisplayDateWithoutYear(date: Date | string | undefined) {
  if (!date) return "Unknown date";
  const dateObj = toServiceHistoryDate(date);
  if (Number.isNaN(dateObj.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(dateObj);
}
