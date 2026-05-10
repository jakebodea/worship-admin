import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/http/client";
import { queryKeys } from "@/lib/query-keys";
import type {
  PeopleDashboardData,
  PeopleDashboardRange,
} from "@/lib/use-cases/planning-center/people-dashboard-types";

export function usePeopleDashboard(range: PeopleDashboardRange) {
  return useQuery<PeopleDashboardData>({
    queryKey: queryKeys.peopleDashboard(range),
    queryFn: () => getJson<PeopleDashboardData>(`/api/people/dashboard?range=${range}`),
    staleTime: 2 * 60 * 1000,
  });
}
