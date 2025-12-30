import { useQuery } from "@tanstack/react-query";
import type { Blockout } from "@/lib/types";

export function useBlockouts(personId: string | undefined) {
  return useQuery<Blockout[]>({
    queryKey: ["blockouts", personId],
    queryFn: async () => {
      if (!personId) return [];
      
      const response = await fetch(`/api/blockouts/${personId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blockouts");
      }
      return response.json();
    },
    enabled: !!personId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
