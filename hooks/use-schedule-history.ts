import { useQuery } from "@tanstack/react-query";
import type { PlanPerson, ScheduleFrequency } from "@/lib/types";

interface ScheduleHistoryResponse {
  planPeople: PlanPerson[];
  frequency: ScheduleFrequency;
}

export function useScheduleHistory(
  personId: string | undefined,
  days: number = 90
) {
  return useQuery<ScheduleHistoryResponse>({
    queryKey: ["schedule-history", personId, days],
    queryFn: async () => {
      if (!personId) {
        return {
          planPeople: [],
          frequency: {
            last30Days: 0,
            last60Days: 0,
            last90Days: 0,
            totalServed: 0,
          },
        };
      }

      const response = await fetch(
        `/api/schedule-history/${personId}?days=${days}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch schedule history");
      }
      return response.json();
    },
    enabled: !!personId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
