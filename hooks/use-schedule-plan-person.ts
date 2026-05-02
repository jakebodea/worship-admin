"use client";

import { useEffect, useState } from "react";
import { HttpClientError, postJson } from "@/lib/http/client";

function formatSchedulePayloadError(json: unknown): string {
  if (!json || typeof json !== "object") return "Failed to schedule";
  const payload = json as {
    error?: unknown;
    details?: unknown;
    code?: unknown;
  };

  if (payload.code === "POSITION_MISMATCH" && payload.details && typeof payload.details === "object") {
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
}

function formatScheduleClientError(error: HttpClientError): string {
  if (error.code === "ALREADY_SCHEDULED") return "ALREADY_SCHEDULED";
  if (error.code === "POSITION_MISMATCH" || error.details) {
    return formatSchedulePayloadError({
      error: error.message,
      code: error.code,
      details: error.details,
    });
  }
  return error.message || "Failed to schedule";
}

export function useSchedulePlanPerson({
  serviceTypeId,
  planId,
  teamId,
  positionId,
  canSchedule,
  onScheduleSuccess,
  onScheduleError,
}: {
  serviceTypeId: string | null | undefined;
  planId: string | null | undefined;
  teamId: string | null | undefined;
  positionId: string | null | undefined;
  canSchedule: boolean;
  onScheduleSuccess?: () => void;
  onScheduleError?: (message: string) => void;
}) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  useEffect(() => {
    setIsScheduling(false);
    setScheduleSuccess(false);
    setScheduleError(null);
  }, [serviceTypeId, planId, teamId, positionId]);

  const handleSchedule = async (personId: string) => {
    if (!serviceTypeId || !planId || !teamId || !positionId || isScheduling || !canSchedule) return;

    setIsScheduling(true);
    setScheduleError(null);

    try {
      await postJson<{ success: boolean }>("/api/schedule", {
        serviceTypeId,
        personId,
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

  return { isScheduling, scheduleSuccess, scheduleError, handleSchedule };
}
