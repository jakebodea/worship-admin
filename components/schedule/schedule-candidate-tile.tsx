"use client";

import { type ReactNode } from "react";
import { CalendarPlus, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSchedulePlanPerson } from "@/hooks/use-schedule-plan-person";
import { PLAN_HISTORY_HALF_RANGE_DAYS } from "@/lib/planning-center/schedule-load-constants";
import {
  buildServiceHistoryGroups,
  formatCombinedHistoryPositionLabel,
  formatHistoryStatusLabel,
  formatScheduleFrequencyLine,
  formatServiceHistoryDisplayDate,
  getHistoryStatusBadgeClass,
  toServiceHistoryDate,
} from "@/lib/use-cases/planning-center/people/service-history-display";
import type { PersonWithAvailability } from "@/lib/types";
import { cn } from "@/lib/utils";

type StatusVariant = "confirmed" | "scheduled" | "declined" | "blocked" | "available";

const STATUS_META: Record<
  StatusVariant,
  { label: string; ring: string; pill: string }
> = {
  confirmed: {
    label: "Confirmed",
    ring: "ring-emerald-500/70",
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  scheduled: {
    label: "On slot",
    ring: "ring-amber-500/70",
    pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  declined: {
    label: "Declined",
    ring: "ring-red-500/70",
    pill: "bg-red-500/15 text-red-600 dark:text-red-400",
  },
  blocked: {
    label: "Blocked",
    ring: "ring-red-500/70",
    pill: "bg-red-500/15 text-red-600 dark:text-red-400",
  },
  available: {
    label: "",
    ring: "ring-border/40",
    pill: "",
  },
};

function recTone(score: number): string {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-amber-700 dark:text-amber-400";
  return "text-orange-700 dark:text-orange-400";
}

function recBar(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-orange-500";
}

/** Sentinel kept for compatibility with strip skeleton/layout; rows now flow vertically. */
export const SCHEDULE_STRIP_MIN_HEIGHT_CLASS = "";

function PopoverPanel({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-popover px-5 py-4 shadow-md outline-none",
        className
      )}
    >
      <p className="text-base font-semibold tracking-tight text-foreground">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export interface ScheduleCandidateTileProps {
  person: PersonWithAvailability;
  serviceTypeId?: string | null;
  planId?: string | null;
  teamId?: string | null;
  positionId?: string | null;
  onScheduleSuccess?: () => void;
  onScheduleError?: (message: string) => void;
}

export function ScheduleCandidateTile({
  person,
  serviceTypeId,
  planId,
  teamId,
  positionId,
  onScheduleSuccess,
  onScheduleError,
}: ScheduleCandidateTileProps) {
  const isConfirmed = !!person.isConfirmedForSelectedPlanPosition;
  const isDeclined = !!person.isDeclinedForSelectedPlanPosition;
  const isBlocked = !!person.isBlockedForDate;
  const fromServerScheduled = !!person.isScheduledForSelectedPlanPosition || isConfirmed;

  const missingSelection = !serviceTypeId || !planId || !teamId || !positionId;
  const canScheduleForHook =
    !missingSelection && !isBlocked && !isDeclined && !fromServerScheduled;

  const { isScheduling, scheduleSuccess, scheduleError, handleSchedule } = useSchedulePlanPerson({
    serviceTypeId,
    planId,
    teamId,
    positionId,
    canSchedule: canScheduleForHook,
    onScheduleSuccess,
    onScheduleError,
  });

  const isScheduled = fromServerScheduled || scheduleSuccess;
  const selectedPlanAssignments = person.selectedPlanAssignmentLabels ?? [];
  const isScheduledElsewhereOnService =
    !isScheduled && !isDeclined && selectedPlanAssignments.length > 0;

  const statusVariant: StatusVariant = isBlocked
    ? "blocked"
    : isDeclined
      ? "declined"
      : isConfirmed
        ? "confirmed"
        : isScheduled
          ? "scheduled"
          : "available";
  const statusMeta = STATUS_META[statusVariant];

  const recommendationPercentage =
    isBlocked || person.recommendationScore === undefined
      ? null
      : Math.round(person.recommendationScore);

  const disableReason = missingSelection
    ? "Select service type, plan, team, and position to schedule"
    : isBlocked
      ? "Person is blocked for this date"
      : isDeclined
        ? "Person declined this position"
        : isScheduled
          ? "Already scheduled for this selected plan and position"
          : undefined;

  const canSchedule = !disableReason;

  const initials = `${person.firstName?.[0] ?? ""}${person.lastName?.[0] ?? ""}` || "?";

  const historyGroups = [...buildServiceHistoryGroups(person.serviceHistory ?? [])].sort(
    (a, b) =>
      toServiceHistoryDate(a.primary.date).getTime() - toServiceHistoryDate(b.primary.date).getTime()
  );
  const scheduleLoadLine = formatScheduleFrequencyLine(person.frequency);
  const latestHistory = historyGroups[historyGroups.length - 1];

  const scheduledForShort =
    selectedPlanAssignments.length === 0
      ? null
      : selectedPlanAssignments.length === 1
        ? selectedPlanAssignments[0]
        : `${selectedPlanAssignments[0]} +${selectedPlanAssignments.length - 1}`;

  const rehearsalCount = latestHistory?.rehearsals.length ?? 0;

  const contextLine: ReactNode = isScheduledElsewhereOnService && scheduledForShort ? (
    <span className="text-amber-700 dark:text-amber-400">Also serving: {scheduledForShort}</span>
  ) : latestHistory ? (
    <>
      <span className="text-foreground/80">
        Last: {formatServiceHistoryDisplayDate(latestHistory.primary.date)}
      </span>
      <span className="text-muted-foreground/70"> · </span>
      <span className="truncate">
        {formatCombinedHistoryPositionLabel(latestHistory.primary, latestHistory.additionalServices)}
      </span>
      {rehearsalCount > 0 ? (
        <span className="ml-1 shrink-0 text-muted-foreground/70">
          {" "}+{rehearsalCount} rehearsal{rehearsalCount === 1 ? "" : "s"}
        </span>
      ) : null}
    </>
  ) : (
    <span className="italic opacity-70">No recent history</span>
  );

  return (
    <article
      className={cn(
        "group/row relative flex items-center gap-3 px-4 py-3.5 transition-colors",
        "hover:bg-muted/30"
      )}
    >
      <Avatar
        className={cn(
          "size-10 shrink-0 ring-2 ring-offset-1 ring-offset-background",
          statusMeta.ring
        )}
      >
        <AvatarImage src={person.photoThumbnailUrl || undefined} alt={person.fullName} />
        <AvatarFallback className="bg-muted text-xs font-medium">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-medium leading-tight text-foreground">
            {person.fullName}
          </p>
          {statusVariant !== "available" ? (
            <span
              className={cn(
                "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                statusMeta.pill
              )}
            >
              {statusMeta.label}
            </span>
          ) : null}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex min-w-0 items-center gap-1 truncate text-left text-xs text-muted-foreground hover:text-foreground"
            >
              {contextLine}
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 border-0 bg-transparent p-0 shadow-none"
            align="start"
            sideOffset={6}
          >
            <PopoverPanel title="Schedule context">
              <div className="space-y-3">
                <div className="border-b border-border/40 pb-3">
                  {scheduleLoadLine ? (
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium tabular-nums text-foreground">{scheduleLoadLine}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {`Distinct service or rehearsal days in the ±${PLAN_HISTORY_HALF_RANGE_DAYS} day window around this plan (org calendar).`}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No frequency summary</p>
                  )}
                </div>
                <ScrollArea className="max-h-[min(22rem,50vh)] pr-3">
                  {historyGroups.length === 0 ? (
                    <p className="py-2 text-center text-sm text-muted-foreground">
                      Nothing in this window.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {historyGroups.map(({ dayKey, primary, additionalServices, rehearsals }) => (
                        <li key={dayKey} className="border-b border-border/35 pb-3 last:border-0 last:pb-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-medium text-foreground">
                              {formatServiceHistoryDisplayDate(primary.date)}
                            </span>
                            <span
                              className={cn(
                                "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium",
                                getHistoryStatusBadgeClass(primary.status)
                              )}
                            >
                              {formatHistoryStatusLabel(primary.status)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-snug text-foreground">
                            {formatCombinedHistoryPositionLabel(primary, additionalServices)}
                          </p>
                          {rehearsals.length > 0 ? (
                            <p className="mt-1.5 text-[10px] text-muted-foreground">
                              +{rehearsals.length} rehearsal{rehearsals.length === 1 ? "" : "s"}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
              </div>
            </PopoverPanel>
          </PopoverContent>
        </Popover>
      </div>

      <div className="hidden w-28 shrink-0 sm:block">
        {recommendationPercentage !== null ? (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex w-full flex-col items-end gap-1.5 text-right"
                aria-label={`${recommendationPercentage} percent fit`}
              >
                <span className={cn("text-sm font-semibold tabular-nums leading-none", recTone(recommendationPercentage))}>
                  {recommendationPercentage}
                  <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">%</span>
                </span>
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted/50">
                  <div
                    className={cn("h-full rounded-full transition-all", recBar(recommendationPercentage))}
                    style={{ width: `${Math.max(4, recommendationPercentage)}%` }}
                  />
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 border-0 bg-transparent p-0 shadow-none" align="end">
              <PopoverPanel title="Why this ranking">
                {person.recommendationReasoning?.length ? (
                  <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {person.recommendationReasoning.map((reason, index) => (
                      <li key={`${person.id}-reason-${index}`}>{reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No reasoning recorded for this score.</p>
                )}
              </PopoverPanel>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="text-right text-xs text-muted-foreground">—</div>
        )}
      </div>

      <div className="w-20 shrink-0 text-right">
        {!isScheduled ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-full gap-1.5"
            disabled={!canSchedule || isScheduling}
            onClick={() => void handleSchedule(person.id)}
            title={disableReason}
          >
            {isScheduling ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span className="hidden sm:inline">Adding</span>
              </>
            ) : (
              <>
                <CalendarPlus className="size-3.5 opacity-70" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </Button>
        ) : (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Scheduled
          </span>
        )}
      </div>

      {scheduleError ? (
        <p className="absolute -bottom-1 left-14 text-[10px] text-destructive">{scheduleError}</p>
      ) : null}
    </article>
  );
}
