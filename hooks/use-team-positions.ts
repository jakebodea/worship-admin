import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/http/client";
import type { TeamPositionGroup } from "@/lib/types";
import { queryKeys } from "@/lib/query-keys";

const TEAM_POSITIONS_STALE_TIME_MS = 10 * 60 * 1000;

function buildTeamPositionsUrl(
  serviceTypeId: string,
  planId: string,
  seriesId: string | null
): string {
  const params = new URLSearchParams({
    service_type_id: serviceTypeId,
    plan_id: planId,
  });
  if (seriesId) {
    params.set("series_id", seriesId);
  }
  return `/api/team-positions?${params.toString()}`;
}

export function createTeamPositionsQueryOptions(
  serviceTypeId: string | null,
  planId: string | null,
  seriesId: string | null
) {
  return {
    queryKey: queryKeys.teamPositions(serviceTypeId, planId, seriesId),
    queryFn: async () => {
      if (!serviceTypeId || !planId) {
        return [];
      }
      return getJson<TeamPositionGroup[]>(
        buildTeamPositionsUrl(serviceTypeId, planId, seriesId)
      );
    },
    staleTime: TEAM_POSITIONS_STALE_TIME_MS,
  };
}

export function useTeamPositions(
  serviceTypeId: string | null,
  planId: string | null,
  seriesId: string | null
) {
  return useQuery<TeamPositionGroup[]>({
    ...createTeamPositionsQueryOptions(serviceTypeId, planId, seriesId),
    enabled: !!serviceTypeId && !!planId,
  });
}
