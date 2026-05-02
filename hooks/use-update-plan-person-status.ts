"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HttpClientError, patchJson } from "@/lib/http/client";

export type PlanPersonStatusCode = "C" | "U" | "D";

function formatUpdateStatusError(error: unknown): string {
  if (error instanceof HttpClientError) {
    return error.message || "Failed to update status";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Failed to update status";
}

export function useUpdatePlanPersonStatus({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (message: string) => void;
} = {}) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleUpdate = async (
    planPersonId: string | null | undefined,
    status: PlanPersonStatusCode
  ) => {
    if (!planPersonId || isUpdating) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      await patchJson<{ success: boolean }>(
        `/api/schedule/${encodeURIComponent(planPersonId)}/status`,
        { status }
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["team-positions"] }),
        queryClient.invalidateQueries({ queryKey: ["people"] }),
      ]);

      onSuccess?.();
    } catch (err) {
      const message = formatUpdateStatusError(err);
      setUpdateError(message);
      onError?.(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, updateError, handleUpdate };
}
