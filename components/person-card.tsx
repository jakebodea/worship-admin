"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HttpClientError, postJson } from "@/lib/http/client";
import { PLAN_HISTORY_HALF_RANGE_DAYS } from "@/lib/planning-center/schedule-load-constants";
import type { PersonWithAvailability, ScheduleFrequency, ServiceHistoryItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertCircle, CalendarPlus, Loader2 } from "lucide-react";

interface PersonCardProps {
  person: PersonWithAvailability;
  serviceTypeId?: string | null;
  planId?: string | null;
  teamId?: string | null;
  positionId?: string | null;
  onScheduleSuccess?: () => void;
  onScheduleError?: (message: string) => void;
}

type StatusVariant = "confirmed" | "scheduled" | "declined" | "blocked" | "available";

const STATUS_STYLES: Record<
  StatusVariant,
  {
    label: string;
    badgeClass: string;
    cardClass: string;
  }
> = {
  confirmed: {
    label: "Confirmed",
    badgeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700",
    cardClass: "ring-1 ring-emerald-500/15",
  },
  scheduled: {
    label: "Scheduled",
    badgeClass: "border-amber-500/40 bg-amber-500/10 text-amber-700",
    cardClass: "ring-1 ring-amber-500/15",
  },
  declined: {
    label: "Declined",
    badgeClass: "border-red-500/40 bg-red-500/10 text-red-700",
    cardClass: "ring-1 ring-red-500/15",
  },
  blocked: {
    label: "Blocked",
    badgeClass: "border-red-500/40 bg-red-500/10 text-red-700",
    cardClass: "ring-1 ring-red-500/15 opacity-70",
  },
  available: {
    label: "Available",
    badgeClass: "border-slate-300 bg-background text-muted-foreground",
    cardClass: "",
  },
};

/** Distinct engagement days in the plan-history band (parity: past = service days + rehearsal-only days; future = same split). */
function formatScheduleLoadLine(frequency: ScheduleFrequency | undefined): string | null {
  if (!frequency) return null;
  const served =
    frequency.recentServedDays + (frequency.recentRehearsalOnlyDays ?? 0);
  const upcoming =
    (frequency.upcomingServices ?? 0) + (frequency.upcomingRehearsals ?? 0);
  return `${served} served | ${upcoming} upcoming`;
}

function toDate(value: Date | string | undefined) {
  if (value instanceof Date) return value;
  const parsed = value ? new Date(value) : new Date(NaN);
  return parsed;
}

function formatDisplayDate(date: Date | string | undefined) {
  if (!date) return "Unknown date";
  const dateObj = toDate(date);
  if (Number.isNaN(dateObj.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateObj);
}

function getRecommendationBadgeTone(score: number) {
  if (score >= 80) return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700";
  if (score >= 50) return "border-amber-500/40 bg-amber-500/10 text-amber-700";
  return "border-orange-500/40 bg-orange-500/10 text-orange-700";
}

function formatHistoryStatusLabel(status: string | undefined): string {
  const raw = (status || "").trim();
  const normalized = raw.toLowerCase();
  if (raw === "C" || normalized === "confirmed") return "Confirmed";
  if (raw === "U" || normalized === "unconfirmed") return "Scheduled";
  if (raw === "D" || normalized === "declined") return "Declined";
  return raw || "Unknown";
}

function getHistoryStatusBadgeClass(status: string | undefined): string {
  const raw = (status || "").trim();
  const normalized = raw.toLowerCase();
  if (raw === "C" || normalized === "confirmed") {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700";
  }
  if (raw === "U" || normalized === "unconfirmed") {
    return "border-amber-500/40 bg-amber-500/10 text-amber-700";
  }
  if (raw === "D" || normalized === "declined") {
    return "border-red-500/40 bg-red-500/10 text-red-700";
  }
  return "border-slate-300 bg-background text-muted-foreground";
}

function toDayKey(value: Date | string | undefined): string | null {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

type HistoryGroup = {
  dayKey: string;
  primary: ServiceHistoryItem;
  additionalServices: ServiceHistoryItem[];
  rehearsals: ServiceHistoryItem[];
};

function buildHistoryGroups(items: ServiceHistoryItem[]): HistoryGroup[] {
  const bySchedule = new Map<string, ServiceHistoryItem[]>();
  const order: string[] = [];

  for (const item of items) {
    const key = item.sourceScheduleId || item.id;
    if (!bySchedule.has(key)) {
      bySchedule.set(key, []);
      order.push(key);
    }
    bySchedule.get(key)!.push(item);
  }

  const baseGroups = order.map((key) => {
    const groupItems = [...(bySchedule.get(key) || [])].sort(
      (a, b) => toDate(a.date).getTime() - toDate(b.date).getTime()
    );
    const primary =
      groupItems.find((item) => item.timeType === "service") ??
      groupItems.find((item) => item.timeType !== "rehearsal") ??
      groupItems[0]!;

    const primaryDayKey = toDayKey(primary.date);
    const seenRehearsalDays = new Set<string>();
    const additionalServices = groupItems.filter((item) => {
      if (item.id === primary.id) return false;
      return item.timeType !== "rehearsal";
    });
    const rehearsals = groupItems.filter((item) => {
      if (item.id === primary.id || item.timeType !== "rehearsal") return false;
      const rehearsalDayKey = toDayKey(item.date);
      if (primaryDayKey && rehearsalDayKey && primaryDayKey === rehearsalDayKey) return false;
      if (rehearsalDayKey && seenRehearsalDays.has(rehearsalDayKey)) return false;
      if (rehearsalDayKey) seenRehearsalDays.add(rehearsalDayKey);
      return true;
    });

    return { dayKey: key, primary, additionalServices, rehearsals };
  });

  const mergedGroups = new Map<string, HistoryGroup>();
  const mergedOrder: string[] = [];

  for (const group of baseGroups) {
    const mergeKey = [
      toDayKey(group.primary.date) || group.dayKey,
      group.primary.teamName || "",
      group.primary.serviceTypeName || "",
      group.primary.planTitle || "",
      (group.primary.status || "").trim().toLowerCase(),
    ].join("|");

    const existing = mergedGroups.get(mergeKey);
    if (!existing) {
      mergedGroups.set(mergeKey, {
        dayKey: mergeKey,
        primary: group.primary,
        additionalServices: [...group.additionalServices],
        rehearsals: [...group.rehearsals],
      });
      mergedOrder.push(mergeKey);
      continue;
    }

    existing.additionalServices.push(group.primary, ...group.additionalServices);

    const seenRehearsalIds = new Set(existing.rehearsals.map((item) => item.id));
    const seenRehearsalDayKeys = new Set(
      existing.rehearsals.map((r) => toDayKey(r.date)).filter((k): k is string => k != null)
    );
    for (const rehearsal of group.rehearsals) {
      if (seenRehearsalIds.has(rehearsal.id)) continue;
      const rehearsalDay = toDayKey(rehearsal.date);
      if (rehearsalDay && seenRehearsalDayKeys.has(rehearsalDay)) continue;
      existing.rehearsals.push(rehearsal);
      seenRehearsalIds.add(rehearsal.id);
      if (rehearsalDay) seenRehearsalDayKeys.add(rehearsalDay);
    }
  }

  return mergedOrder.map((key) => mergedGroups.get(key)!);
}

function formatCombinedPositionLabel(primary: ServiceHistoryItem, additionalServices: ServiceHistoryItem[]) {
  const positions = [primary, ...additionalServices]
    .map((item) => item.teamPositionName?.trim())
    .filter((value): value is string => Boolean(value));

  const uniquePositions = Array.from(new Set(positions));
  const positionText = uniquePositions.join(", ");
  if (!positionText) return "Unknown position";

  return primary.teamName ? `${primary.teamName} - ${positionText}` : positionText;
}

export function PersonCard({
  person,
  serviceTypeId,
  planId,
  teamId,
  positionId,
  onScheduleSuccess,
  onScheduleError,
}: PersonCardProps) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  useEffect(() => {
    setIsScheduling(false);
    setScheduleSuccess(false);
    setScheduleError(null);
  }, [serviceTypeId, planId, teamId, positionId]);

  const isConfirmed = !!person.isConfirmedForSelectedPlanPosition;
  const isDeclined = !!person.isDeclinedForSelectedPlanPosition;
  const isScheduled = !!person.isScheduledForSelectedPlanPosition || scheduleSuccess;
  const isBlocked = !!person.isBlockedForDate;
  const serviceHistory = person.serviceHistory || [];
  const historyGroups = [...buildHistoryGroups(serviceHistory)].sort(
    (a, b) => toDate(a.primary.date).getTime() - toDate(b.primary.date).getTime()
  );
  const frequency = person.frequency;
  const scheduleLoadLine = formatScheduleLoadLine(frequency);

  const statusVariant: StatusVariant = isBlocked
    ? "blocked"
    : isDeclined
      ? "declined"
      : isConfirmed
        ? "confirmed"
        : isScheduled
          ? "scheduled"
          : "available";
  const statusStyles = STATUS_STYLES[statusVariant];

  const recommendationPercentage =
    isBlocked || person.recommendationScore === undefined
      ? null
      : Math.round(person.recommendationScore);

  const missingSelection = !serviceTypeId || !planId || !teamId || !positionId;
  const disableReason = missingSelection
    ? "Select service type, plan, team, and position to schedule"
    : isBlocked
      ? "Person is blocked for this date"
      : isScheduled
        ? "Already scheduled for this selected plan and position"
        : undefined;

  const canSchedule = !disableReason;

  const initials = `${person.firstName?.[0] ?? ""}${person.lastName?.[0] ?? ""}` || "?";

  const formatScheduleError = (json: unknown): string => {
    if (!json || typeof json !== "object") return "Failed to schedule";
    const payload = json as {
      error?: unknown;
      details?: unknown;
      code?: unknown;
    };

    if (
      payload.code === "POSITION_MISMATCH" &&
      payload.details &&
      typeof payload.details === "object"
    ) {
      const details = payload.details as {
        selected?: { teamName?: string; positionName?: string };
        created?: { teamPositionName?: string };
      };
      const selectedTeam = details.selected?.teamName || "Unknown team";
      const selectedPosition = details.selected?.positionName || "Unknown position";
      const created = details.created?.teamPositionName || "Unknown position";
      return `Created in "${created}" instead of "${selectedTeam} - ${selectedPosition}".`;
    }

    if (typeof payload.details === "string" && payload.details.length > 0) return payload.details;
    if (typeof payload.error === "string" && payload.error.length > 0) return payload.error;
    return "Failed to schedule";
  };

  const formatScheduleClientError = (error: HttpClientError): string => {
    if (error.code === "ALREADY_SCHEDULED") return "ALREADY_SCHEDULED";
    if (error.code === "POSITION_MISMATCH" || error.details) {
      return formatScheduleError({
        error: error.message,
        code: error.code,
        details: error.details,
      });
    }
    return error.message || "Failed to schedule";
  };

  const handleSchedule = async () => {
    if (!serviceTypeId || !planId || !teamId || !positionId || isScheduling || !canSchedule) return;

    setIsScheduling(true);
    setScheduleError(null);

    try {
      await postJson<{ success: boolean }>("/api/schedule", {
        serviceTypeId,
        personId: person.id,
        planId,
        teamId,
        positionId,
      });
      setScheduleSuccess(true);
      onScheduleSuccess?.();
    } catch (err) {
      if (err instanceof HttpClientError && err.code === "ALREADY_SCHEDULED") {
        setScheduleSuccess(true);
        onScheduleSuccess?.();
        return;
      }

      const message =
        err instanceof HttpClientError
          ? formatScheduleClientError(err)
          : err instanceof Error
            ? err.message
            : "Failed to schedule";
      setScheduleError(message);
      onScheduleError?.(message);
    } finally {
      setIsScheduling(false);
    }
  };

  const statusOverlayClass =
    statusVariant === "confirmed"
      ? "bg-green-500/10 border-green-500/30"
      : statusVariant === "scheduled"
        ? "bg-yellow-500/10 border-yellow-500/30"
        : statusVariant === "blocked" || statusVariant === "declined"
          ? "bg-red-500/10 border-red-500/30"
          : null;

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col gap-4 overflow-hidden border-border/50 py-4 shadow-none transition-shadow hover:shadow-sm",
        statusStyles.cardClass
      )}
    >
      {statusOverlayClass ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-10 rounded-lg border-2",
            statusOverlayClass
          )}
        />
      ) : null}
      <CardHeader className="pb-2 pt-0">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 ring-1 ring-border">
            <AvatarImage src={person.photoThumbnailUrl || undefined} alt={person.fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold">{person.fullName}</h3>
              {statusVariant !== "available" ? (
                <Badge variant="outline" className={cn("text-[11px]", statusStyles.badgeClass)}>
                  {statusStyles.label}
                </Badge>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {recommendationPercentage !== null && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Badge
                      variant="outline"
                      className={cn(
                        "cursor-help text-[11px] font-semibold",
                        getRecommendationBadgeTone(recommendationPercentage)
                      )}
                    >
                      {recommendationPercentage}% Recommended
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Recommendation Reasoning</h4>
                      {person.recommendationReasoning?.length ? (
                        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                          {person.recommendationReasoning.map((reason, index) => (
                            <li key={`${person.id}-reason-${index}`}>{reason}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No reasoning available for this recommendation.
                        </p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              {scheduleError && (
                <Badge variant="outline" className="text-[11px] border-red-500/40 bg-red-500/10 text-red-700">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Action Error
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-3">
        <section className="space-y-1.5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recent schedule
            </h4>
            {scheduleLoadLine ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="max-w-[14rem] text-right text-[11px] leading-snug text-muted-foreground underline decoration-dotted decoration-muted-foreground/50 underline-offset-2"
                  >
                    {scheduleLoadLine}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72" align="end">
                  <p className="text-sm text-muted-foreground">
                    {`Total distinct days on the schedule (service or rehearsal), within ±${PLAN_HISTORY_HALF_RANGE_DAYS} days of this plan.`}
                  </p>
                </PopoverContent>
              </Popover>
            ) : null}
          </div>

          {historyGroups.length === 0 ? (
            <div className="rounded-md border border-dashed border-border/60 px-3 py-2 text-xs text-muted-foreground">
              No recent schedule history
            </div>
          ) : (
            <div className="space-y-2">
              {historyGroups.map(({ dayKey, primary, additionalServices, rehearsals }) => {
                return (
                  <div
                    key={dayKey}
                    className="rounded-md border border-border/60 bg-muted/15 px-3 py-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-medium">{formatDisplayDate(primary.date)}</div>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "h-5 px-1.5 text-[10px]",
                            getHistoryStatusBadgeClass(primary.status)
                          )}
                        >
                          {formatHistoryStatusLabel(primary.status)}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-foreground">
                      {formatCombinedPositionLabel(primary, additionalServices)}
                      {primary.serviceTypeName ? (
                        <span className="text-muted-foreground">
                          {" "}
                          ({primary.serviceTypeName})
                        </span>
                      ) : null}
                    </div>
                    {primary.planTitle ? (
                      <div className="mt-1 truncate text-[11px] italic text-muted-foreground">
                        {primary.planTitle}
                      </div>
                    ) : null}

                    {rehearsals.length > 0 ? (
                      <div className="mt-2 space-y-1.5 border-l-2 border-border/50 pl-2">
                        {rehearsals.map((rehearsal) => (
                          <div
                            key={rehearsal.id}
                            className="rounded-sm bg-muted/40 px-2 py-1.5 text-[11px] text-muted-foreground"
                          >
                            <div className="font-medium">Rehearsal · {formatDisplayDate(rehearsal.date)}</div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-auto space-y-2 border-t border-border/60 pt-2.5">
          {!isScheduled ? (
            <Button
              size="sm"
              className="w-full"
              disabled={!canSchedule || isScheduling}
              onClick={handleSchedule}
              title={disableReason}
            >
              {isScheduling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <CalendarPlus className="h-4 w-4" />
                  Schedule
                </>
              )}
            </Button>
          ) : null}

          {scheduleError ? (
            <p className="text-xs text-destructive">{scheduleError}</p>
          ) : null}
        </section>
      </CardContent>
    </Card>
  );
}
