"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HttpClientError, postJson } from "@/lib/http/client";
import type { PersonWithAvailability, ServiceHistoryItem } from "@/lib/types";
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
  primary: ServiceHistoryItem;
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

  return order.map((key) => {
    const groupItems = [...(bySchedule.get(key) || [])].sort(
      (a, b) => toDate(a.date).getTime() - toDate(b.date).getTime()
    );
    const primary =
      groupItems.find((item) => item.timeType === "service") ??
      groupItems.find((item) => item.timeType !== "rehearsal") ??
      groupItems[0]!;

    const primaryDayKey = toDayKey(primary.date);
    const seenRehearsalDays = new Set<string>();
    const rehearsals = groupItems.filter((item) => {
      if (item.id === primary.id || item.timeType !== "rehearsal") return false;
      const rehearsalDayKey = toDayKey(item.date);
      if (primaryDayKey && rehearsalDayKey && primaryDayKey === rehearsalDayKey) return false;
      if (rehearsalDayKey && seenRehearsalDays.has(rehearsalDayKey)) return false;
      if (rehearsalDayKey) seenRehearsalDays.add(rehearsalDayKey);
      return true;
    });

    return { primary, rehearsals };
  });
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
  const historyGroups = buildHistoryGroups(serviceHistory);

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
        "relative overflow-hidden border transition-shadow hover:shadow-md",
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
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          statusVariant === "confirmed" && "bg-emerald-500/70",
          statusVariant === "scheduled" && "bg-amber-500/70",
          statusVariant === "declined" && "bg-red-500/70",
          statusVariant === "blocked" && "bg-red-500/70",
          statusVariant === "available" && "bg-slate-200"
        )}
      />

      <CardHeader className="pb-3 pt-4">
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

      <CardContent className="space-y-4">
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recent Schedule History
            </h4>
            {historyGroups.length > 0 && (
              <span className="text-[11px] text-muted-foreground">
                {serviceHistory.length} recent
              </span>
            )}
          </div>

          {historyGroups.length === 0 ? (
            <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
              No recent schedule history
            </div>
          ) : (
            <div className="space-y-2">
              {historyGroups.map(({ primary, rehearsals }) => {
                return (
                  <div
                    key={primary.id}
                    className="rounded-md border bg-muted/20 px-3 py-2"
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
                      {primary.teamName ? `${primary.teamName} - ` : ""}
                      {primary.teamPositionName}
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
                      <div className="mt-2 space-y-1.5 border-l-2 border-muted pl-2">
                        {rehearsals.map((rehearsal) => (
                          <div
                            key={rehearsal.id}
                            className="rounded-sm bg-muted/40 px-2 py-1.5 text-[11px] text-muted-foreground"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <div className="font-medium">
                                {formatDisplayDate(rehearsal.date)}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "h-4 px-1 text-[10px]",
                                    getHistoryStatusBadgeClass(rehearsal.status)
                                  )}
                                >
                                  {formatHistoryStatusLabel(rehearsal.status)}
                                </Badge>
                              </div>
                            </div>
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

        <section className="space-y-2 border-t pt-3">
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
