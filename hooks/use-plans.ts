import { useQuery } from "@tanstack/react-query";
import type { Plan } from "@/lib/types";

export function usePlans(serviceTypeId: string | null) {
  return useQuery<Plan[]>({
    queryKey: ["plans", serviceTypeId],
    queryFn: async () => {
      console.log("[usePlans] Fetching plans for service type:", serviceTypeId);
      if (!serviceTypeId) {
        return [];
      }
      const response = await fetch(
        `/api/plans?service_type_id=${serviceTypeId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }
      const data = await response.json();
      console.log("[usePlans] Fetched plans:", data);
      return data;
    },
    enabled: !!serviceTypeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
