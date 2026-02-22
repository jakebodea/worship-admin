import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/http/client";
import type { Plan } from "@/lib/types";
import { queryKeys } from "@/lib/query-keys";

export function usePlans(serviceTypeId: string | null) {
  return useQuery<Plan[]>({
    queryKey: queryKeys.plans(serviceTypeId),
    queryFn: async () => {
      if (!serviceTypeId) {
        return [];
      }
      return getJson<Plan[]>(`/api/plans?service_type_id=${serviceTypeId}`);
    },
    enabled: !!serviceTypeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
