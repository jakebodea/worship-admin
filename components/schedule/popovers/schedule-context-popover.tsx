"use client";

import { Fragment, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PLAN_HISTORY_HALF_RANGE_DAYS } from "@/lib/planning-center/schedule-load-constants";
import {
  buildServiceHistoryGroups,
  formatCombinedHistoryPositionLabel,
  formatServiceHistoryDisplayDate,
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
    <ul className="grid grid-cols-[auto_auto_1fr] items-start gap-x-3 gap-y-1.5 px-2 py-2">
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
            <span className="whitespace-nowrap text-sm font-medium tabular-nums text-foreground">
              {formatServiceHistoryDisplayDate(primary.date)}
            </span>
            <span className="text-sm leading-snug text-muted-foreground">
              {formatCombinedHistoryPositionLabel(primary, additionalServices)}
            </span>
          </li>
          {rehearsals.map((rehearsal) => (
            <li key={rehearsal.id} className="contents">
              <span aria-hidden />
              <span className="whitespace-nowrap pl-3 text-xs tabular-nums text-muted-foreground/70">
                {formatServiceHistoryDisplayDate(rehearsal.date)}
              </span>
              <span className="text-xs leading-snug text-muted-foreground/60">Rehearsal</span>
            </li>
          ))}
        </Fragment>
      ))}
    </ul>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" sideOffset={6} className="w-[26rem] p-0">
        <div className="border-b border-border/40 px-4 py-2.5">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            Schedule ±{PLAN_HISTORY_HALF_RANGE_DAYS} days from this service
          </p>
        </div>
        {historyGroups.length === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground">No recent history</p>
        ) : historyGroups.length > 8 ? (
          <ScrollArea className="max-h-96">{rows}</ScrollArea>
        ) : (
          rows
        )}
      </PopoverContent>
    </Popover>
  );
}
