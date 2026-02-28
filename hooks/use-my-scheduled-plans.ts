import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { postJson } from "@/lib/http/client";
import { queryKeys } from "@/lib/query-keys";

interface MyScheduledPlansResponse {
  planIds: string[];
}

export function useMyScheduledPlans(planIds: string[]) {
  const normalizedPlanIds = useMemo(
    () => [...new Set(planIds)].toSorted((a, b) => a.localeCompare(b)),
    [planIds]
  );
  const planIdsKey = normalizedPlanIds.join(",");

  return useQuery<MyScheduledPlansResponse>({
    queryKey: queryKeys.myScheduledPlans(planIdsKey),
    queryFn: async () => {
      if (normalizedPlanIds.length === 0) {
        return { planIds: [] };
      }

      return postJson<MyScheduledPlansResponse>("/api/my-scheduled-plans", {
        planIds: normalizedPlanIds,
      });
    },
    enabled: normalizedPlanIds.length > 0,
    staleTime: 60 * 1000,
  });
}
