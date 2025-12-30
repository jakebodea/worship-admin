import { useQuery } from "@tanstack/react-query";
import type { Team } from "@/lib/types";

export function useTeams() {
  return useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await fetch("/api/teams");
      if (!response.ok) {
        throw new Error("Failed to fetch teams");
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
