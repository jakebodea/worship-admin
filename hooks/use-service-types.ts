import { useQuery } from "@tanstack/react-query";
import type { ServiceType } from "@/lib/types";

export function useServiceTypes() {
  return useQuery<ServiceType[]>({
    queryKey: ["service-types"],
    queryFn: async () => {
      const response = await fetch("/api/service-types");
      if (!response.ok) {
        throw new Error("Failed to fetch service types");
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
