"use client";

import { type ReactNode } from "react";
import { CalendarPlus, Info, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlanPersonStatusMenu, type PlanPersonStatusValue } from "@/components/schedule/plan-person-status-menu";
import { RecommendationPopover } from "@/components/schedule/popovers/recommendation-popover";
import { ScheduleContextPopover } from "@/components/schedule/popovers/schedule-context-popover";
import { useSchedulePlanPerson } from "@/hooks/use-schedule-plan-person";
import {
  buildServiceHistoryGroups,
  formatCombinedHistoryPositionLabel,
  formatServiceHistoryDisplayDate,
  pickLatestServiceHistoryGroup,
  pickServiceHistoryGroupClosestToReference,
} from "@/lib/use-cases/planning-center/people/service-history-display";
import type { PersonWithAvailability } from "@/lib/types";
import { cn } from "@/lib/utils";

type StatusVariant = "confirmed" | "scheduled" | "declined" | "blocked" | "available";

const STATUS_META: Record<StatusVariant, { label: string }> = {
  confirmed: { label: "Confirmed" },
  scheduled: { label: "On slot" },
  declined: { label: "Declined" },
  blocked: { label: "Blocked" },
  available: { label: "" },
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

export interface ScheduleCandidateTileProps {
  person: PersonWithAvailability;
  serviceTypeId?: string | null;
  planId?: string | null;
  /** Plan sort instant; drives “closest” history summary on the strip. */
  planSortDate?: Date | null;
  orgTimeZone: string;
  teamId?: string | null;
  positionId?: string | null;
  onScheduleSuccess?: () => void;
  onScheduleError?: (message: string) => void;
}

export function ScheduleCandidateTile({
  person,
  serviceTypeId,
  planId,
  planSortDate,
  orgTimeZone,
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

  const historyGroups = buildServiceHistoryGroups(person.serviceHistory ?? []);
  const summaryHistoryGroup =
    planSortDate != null
      ? pickServiceHistoryGroupClosestToReference(historyGroups, planSortDate, orgTimeZone)
      : pickLatestServiceHistoryGroup(historyGroups);

  const scheduledForShort =
    selectedPlanAssignments.length === 0
      ? null
      : selectedPlanAssignments.length === 1
        ? selectedPlanAssignments[0]
        : `${selectedPlanAssignments[0]} +${selectedPlanAssignments.length - 1}`;

  const contextLine: ReactNode = isScheduledElsewhereOnService && scheduledForShort ? (
    <span className="text-amber-700 dark:text-amber-400">Also: {scheduledForShort}</span>
  ) : summaryHistoryGroup ? (
    <>
      <span className="text-foreground/80">
        {formatServiceHistoryDisplayDate(summaryHistoryGroup.primary.date)}
      </span>
      <span className="text-muted-foreground/70"> · </span>
      <span className="truncate">
        {formatCombinedHistoryPositionLabel(
          summaryHistoryGroup.primary,
          summaryHistoryGroup.additionalServices
        )}
      </span>
    </>
  ) : null;

  const serviceHistory = person.serviceHistory ?? [];

  const statusRing =
    statusVariant === "confirmed"
      ? "ring-2 ring-emerald-500/80 ring-offset-2 ring-offset-background"
      : statusVariant === "scheduled"
        ? "ring-2 ring-amber-500/80 ring-offset-2 ring-offset-background"
        : statusVariant === "declined" || statusVariant === "blocked"
          ? "ring-2 ring-red-500/70 ring-offset-2 ring-offset-background"
          : "";

  return (
    <article
      className={cn(
        "group/row relative flex items-center gap-4 px-3 py-3 transition-colors",
        "hover:bg-muted/30"
      )}
    >
      <Avatar
        className={cn("size-9 shrink-0", statusRing)}
        title={statusMeta.label || undefined}
      >
        <AvatarImage src={person.photoThumbnailUrl || undefined} alt={person.fullName} />
        <AvatarFallback className="bg-muted text-xs font-medium">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="truncate text-sm font-medium leading-tight text-foreground">
            {person.fullName}
          </p>
          <ScheduleContextPopover serviceHistory={serviceHistory}>
            <button
              type="button"
              className="inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0 text-muted-foreground/60 hover:text-foreground"
              aria-label="Schedule context"
            >
              <Info className="size-3.5" />
            </button>
          </ScheduleContextPopover>
        </div>
        {contextLine ? (
          <ScheduleContextPopover serviceHistory={serviceHistory}>
            <button
              type="button"
              className="flex min-w-0 items-center gap-1 truncate text-left text-[13px] text-muted-foreground hover:text-foreground"
            >
              {contextLine}
            </button>
          </ScheduleContextPopover>
        ) : null}
      </div>

      <div className="hidden w-28 shrink-0 sm:block">
        {recommendationPercentage !== null ? (
          <RecommendationPopover reasoning={person.recommendationReasoning} personId={person.id}>
            <button
              type="button"
              className="flex w-full flex-col items-end gap-1.5 text-right"
              aria-label={`${recommendationPercentage} percent fit`}
            >
              <span className={cn("text-base font-semibold tabular-nums leading-none", recTone(recommendationPercentage))}>
                {recommendationPercentage}
                <span className="ml-0.5 text-[11px] font-normal text-muted-foreground">%</span>
              </span>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                <div
                  className={cn("h-full rounded-full transition-all", recBar(recommendationPercentage))}
                  style={{ width: `${Math.max(4, recommendationPercentage)}%` }}
                />
              </div>
            </button>
          </RecommendationPopover>
        ) : (
          <div className="text-right text-xs text-muted-foreground">—</div>
        )}
      </div>

      <div className="flex w-20 shrink-0 justify-end">
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
          <PlanPersonStatusMenu
            planPersonId={person.scheduledPlanPersonId}
            currentStatus={
              (isConfirmed
                ? "confirmed"
                : isDeclined
                  ? "declined"
                  : "scheduled") satisfies PlanPersonStatusValue
            }
            onError={onScheduleError}
          />
        )}
      </div>

      {scheduleError ? (
        <p className="absolute -bottom-1 left-14 text-[10px] text-destructive">{scheduleError}</p>
      ) : null}
    </article>
  );
}
