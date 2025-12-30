import { useQuery } from "@tanstack/react-query";
import type { Person } from "@/lib/types";

export function usePeople() {
  return useQuery<Person[]>({
    queryKey: ["people"],
    queryFn: async () => {
      const response = await fetch("/api/people");
      if (!response.ok) {
        throw new Error("Failed to fetch people");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
