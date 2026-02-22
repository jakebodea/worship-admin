import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/http/client";
import type { TeamPositionGroup } from "@/lib/types";
import { queryKeys } from "@/lib/query-keys";

export function useTeamPositions(
  serviceTypeId: string | null,
  planId: string | null,
  seriesId: string | null
) {
  return useQuery<TeamPositionGroup[]>({
    queryKey: queryKeys.teamPositions(serviceTypeId, planId, seriesId),
    queryFn: async () => {
      if (!serviceTypeId || !planId) {
        return [];
      }
      const params = new URLSearchParams({
        service_type_id: serviceTypeId,
        plan_id: planId,
      });
      if (seriesId) {
        params.set("series_id", seriesId);
      }
      return getJson<TeamPositionGroup[]>(`/api/team-positions?${params.toString()}`);
    },
    enabled: !!serviceTypeId && !!planId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
