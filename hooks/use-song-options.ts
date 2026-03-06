import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/http/client";
import { queryKeys } from "@/lib/query-keys";
import type { SongOptionSet } from "@/lib/types";

export function useSongOptions(
  songId: string | null,
  serviceTypeId: string | null
) {
  return useQuery<SongOptionSet | null>({
    queryKey: queryKeys.songOptions(songId, serviceTypeId),
    queryFn: async () => {
      if (!songId || !serviceTypeId) return null;

      const params = new URLSearchParams({
        service_type_id: serviceTypeId,
      });

      return getJson<SongOptionSet>(`/api/songs/${songId}/options?${params.toString()}`);
    },
    enabled: !!songId && !!serviceTypeId,
    staleTime: 5 * 60 * 1000,
  });
}
