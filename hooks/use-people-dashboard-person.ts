import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/http/client";
import { queryKeys } from "@/lib/query-keys";
import type { PeopleDashboardPersonDetail } from "@/lib/use-cases/planning-center/people-dashboard-types";

export function usePeopleDashboardPerson(personId: string, month: string | null) {
  return useQuery<PeopleDashboardPersonDetail>({
    queryKey: queryKeys.peopleDashboardPerson(personId, month),
    queryFn: () => {
      const params = month ? `?month=${encodeURIComponent(month)}` : "";
      return getJson<PeopleDashboardPersonDetail>(`/api/people/dashboard/${personId}${params}`);
    },
    staleTime: 2 * 60 * 1000,
  });
}
