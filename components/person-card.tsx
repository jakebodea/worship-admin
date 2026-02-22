"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HttpClientError, postJson } from "@/lib/http/client";
import type { PersonWithAvailability } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CalendarPlus, Check, Loader2 } from "lucide-react";

interface PersonCardProps {
  person: PersonWithAvailability;
  serviceTypeId?: string | null;
  planId?: string | null;
  teamId?: string | null;
  positionId?: string | null;
  onScheduleSuccess?: () => void;
  onScheduleError?: (message: string) => void;
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
  const isConfirmed = !!person.isConfirmedForSelectedPlanPosition;
  const isScheduled = !!person.isScheduledForSelectedPlanPosition || scheduleSuccess;

  const canSchedule =
    !!serviceTypeId &&
    !!planId &&
    !!teamId &&
    !!positionId &&
    !person.isBlockedForDate &&
    !isScheduled;

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

    if (typeof payload.details === "string" && payload.details.length > 0) {
      return payload.details;
    }
    if (typeof payload.error === "string" && payload.error.length > 0) {
      return payload.error;
    }
    return "Failed to schedule";
  };

  const formatScheduleClientError = (error: HttpClientError): string => {
    if (error.code === "ALREADY_SCHEDULED") {
      return "ALREADY_SCHEDULED";
    }
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
      if (err instanceof HttpClientError) {
        if (err.code === "ALREADY_SCHEDULED") {
          setScheduleSuccess(true);
          onScheduleSuccess?.();
          return;
        }
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

  const initials = `${person.firstName[0]}${person.lastName[0]}`;
  const isBlocked = person.isBlockedForDate || false;
  const serviceHistory = person.serviceHistory || [];

  // Get recommendation percentage
  // Scores are already normalized to 0-100 in the API
  const getRecommendationPercentage = (): number | null => {
    if (isBlocked || person.recommendationScore === undefined) {
      return null;
    }
    // Score is already a percentage (0-100), just round it
    return Math.round(person.recommendationScore);
  };

  const recommendationPercentage = getRecommendationPercentage();

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Unknown date";
    
    // Convert string to Date if needed
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    
    // Format with day of week (3 letters) + date
    const dayOfWeek = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    }).format(dateObj);
    
    const dateStr = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(dateObj);
    
    return `${dayOfWeek}, ${dateStr}`;
  };

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow relative",
        isConfirmed && "bg-green-500/5",
        isScheduled && !isConfirmed && "bg-yellow-500/5",
        isBlocked && "opacity-60"
      )}
    >
      {isConfirmed && (
        <div className="absolute inset-0 bg-green-500/10 border-2 border-green-500/30 rounded-lg pointer-events-none z-10" />
      )}
      {isScheduled && !isConfirmed && (
        <div className="absolute inset-0 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg pointer-events-none z-10" />
      )}
      {isBlocked && (
        <div className="absolute inset-0 bg-red-500/10 border-2 border-red-500/30 rounded-lg pointer-events-none z-10" />
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage
              src={person.photoThumbnailUrl || undefined}
              alt={person.fullName}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold truncate">{person.fullName}</h3>
              {isBlocked && (
                <Badge variant="destructive" className="text-xs">
                  Blocked
                </Badge>
              )}
              {isScheduled && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    isConfirmed
                      ? "border-green-500 text-green-700 bg-green-50"
                      : "border-yellow-500 text-yellow-700 bg-yellow-50"
                  )}
                >
                  {isConfirmed ? "Confirmed" : "Scheduled"}
                </Badge>
              )}
              {recommendationPercentage !== null && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs font-semibold cursor-help",
                        recommendationPercentage >= 80 && "border-green-500 text-green-700 bg-green-50",
                        recommendationPercentage >= 50 && recommendationPercentage < 80 && "border-yellow-500 text-yellow-700 bg-yellow-50",
                        recommendationPercentage < 50 && "border-orange-500 text-orange-700 bg-orange-50"
                      )}
                    >
                      {recommendationPercentage}% Recommended
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Recommendation Reasoning</h4>
                      {person.recommendationReasoning && person.recommendationReasoning.length > 0 ? (
                        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                          {person.recommendationReasoning.map((reason, index) => (
                            <li key={index}>{reason}</li>
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
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {serviceHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Service History</h4>
            <div className="space-y-1.5">
              {serviceHistory.slice(0, 5).map((historyItem) => (
                <div
                  key={historyItem.id}
                  className="text-xs text-muted-foreground border-l-2 border-muted pl-2"
                >
                  <div className="font-medium text-foreground">
                    {formatDate(historyItem.date)}
                  </div>
                  <div>
                    {historyItem.teamName && (
                      <span>{historyItem.teamName} - </span>
                    )}
                    {historyItem.teamPositionName}
                    {historyItem.serviceTypeName && (
                      <span className="text-muted-foreground">
                        {" "}
                        ({historyItem.serviceTypeName})
                      </span>
                    )}
                  </div>
                  {historyItem.planTitle && (
                    <div className="text-muted-foreground italic">
                      {historyItem.planTitle}
                    </div>
                  )}
                </div>
              ))}
              {serviceHistory.length > 5 && (
                <div className="text-xs text-muted-foreground pt-1">
                  +{serviceHistory.length - 5} more
                </div>
              )}
            </div>
          </div>
        )}
        {serviceHistory.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No recent service history
          </p>
        )}

        <div className="pt-3 border-t">
          {isScheduled ? (
            <div
              className={cn(
                "flex items-center gap-2 text-sm",
                isConfirmed ? "text-green-700" : "text-yellow-700"
              )}
            >
              <Check className="h-4 w-4 shrink-0" />
              <span>{isConfirmed ? "Confirmed" : "Scheduled"}</span>
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full"
              disabled={!canSchedule || isScheduling}
              onClick={handleSchedule}
              title={
                !serviceTypeId || !planId || !teamId || !positionId
                  ? "Select service type, plan, team, and position to schedule"
                  : isScheduled
                    ? "Already scheduled for this selected plan and position"
                  : person.isBlockedForDate
                    ? "Person is blocked for this date"
                    : undefined
              }
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
          )}
          {scheduleError && (
            <p className="mt-2 text-xs text-destructive">{scheduleError}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
