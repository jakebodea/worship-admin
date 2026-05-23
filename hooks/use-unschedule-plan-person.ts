"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteJson, HttpClientError } from "@/lib/http/client";

function formatUnscheduleError(error: unknown): string {
  if (error instanceof HttpClientError) return error.message || "Failed to unschedule";
  if (error instanceof Error) return error.message;
  return "Failed to unschedule";
}

export function useUnschedulePlanPerson({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (message: string) => void;
} = {}) {
  const queryClient = useQueryClient();
  const [isUnscheduling, setIsUnscheduling] = useState(false);

  const handleUnschedule = async (
    planPersonId: string | null | undefined,
    context?: { serviceTypeId?: string | null; personId?: string | null; planId?: string | null }
  ) => {
    if (!planPersonId || isUnscheduling) return;

    setIsUnscheduling(true);
    try {
      await deleteJson<{ success: boolean }>(
        `/api/schedule/${encodeURIComponent(planPersonId)}`,
        {
          serviceTypeId: context?.serviceTypeId ?? undefined,
          personId: context?.personId ?? undefined,
          planId: context?.planId ?? undefined,
        }
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["team-positions"] }),
        queryClient.invalidateQueries({ queryKey: ["people"] }),
      ]);

      onSuccess?.();
    } catch (error) {
      onError?.(formatUnscheduleError(error));
    } finally {
      setIsUnscheduling(false);
    }
  };

  return { isUnscheduling, handleUnschedule };
}
