import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/http/client";
import type { ServiceType } from "@/lib/types";
import { queryKeys } from "@/lib/query-keys";

export function useServiceTypes() {
  return useQuery<ServiceType[]>({
    queryKey: queryKeys.serviceTypes(),
    queryFn: () => getJson<ServiceType[]>("/api/service-types"),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
