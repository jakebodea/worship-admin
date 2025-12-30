import { useQuery } from "@tanstack/react-query";
import type { TeamPositionGroup } from "@/lib/types";

export function useTeamPositions(serviceTypeId: string | null) {
  return useQuery<TeamPositionGroup[]>({
    queryKey: ["team-positions", serviceTypeId],
    queryFn: async () => {
      if (!serviceTypeId) {
        return [];
      }
      const response = await fetch(
        `/api/team-positions?service_type_id=${serviceTypeId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch team positions");
      }
      return response.json();
    },
    enabled: !!serviceTypeId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
