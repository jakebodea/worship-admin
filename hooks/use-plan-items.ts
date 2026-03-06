import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/http/client";
import { queryKeys } from "@/lib/query-keys";
import type { PlanItem } from "@/lib/types";

const PLAN_ITEMS_STALE_TIME_MS = 60 * 1000;

export function usePlanItems(
  serviceTypeId: string | null,
  planId: string | null
) {
  return useQuery<PlanItem[]>({
    queryKey: queryKeys.planItems(serviceTypeId, planId),
    queryFn: async () => {
      if (!serviceTypeId || !planId) return [];

      const params = new URLSearchParams({
        service_type_id: serviceTypeId,
        plan_id: planId,
      });

      return getJson<PlanItem[]>(`/api/plan-items?${params.toString()}`);
    },
    enabled: !!serviceTypeId && !!planId,
    staleTime: PLAN_ITEMS_STALE_TIME_MS,
  });
}
