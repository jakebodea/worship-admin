import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/http/client";
import type { PersonWithAvailability } from "@/lib/types";
import { queryKeys } from "@/lib/query-keys";

export function usePeople(
  serviceTypeId: string | null,
  teamId: string | null,
  positionId: string | null,
  planId: string | null = null,
  date: Date | string | null = null
) {
  // Convert date to string for query key (handle both Date and string)
  const dateKey = date 
    ? (typeof date === "string" ? date : date.toISOString())
    : null;

  // Convert date to Date object if it's a string
  const dateObj = date 
    ? (typeof date === "string" ? new Date(date) : date)
    : null;

  return useQuery<PersonWithAvailability[]>({
    queryKey: queryKeys.people(
      serviceTypeId,
      teamId,
      positionId,
      planId,
      dateKey
    ),
    queryFn: async () => {
      if (!positionId || !serviceTypeId) {
        return [];
      }

      const params = new URLSearchParams({
        service_type_id: serviceTypeId,
        position_id: positionId,
      });

      if (teamId) {
        params.append("team_id", teamId);
      }

      if (planId) {
        params.append("plan_id", planId);
      }

      if (dateObj && !isNaN(dateObj.getTime())) {
        params.append("date", dateObj.toISOString());
      }

      return getJson<PersonWithAvailability[]>(`/api/people?${params.toString()}`);
    },
    enabled: !!positionId && !!serviceTypeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
