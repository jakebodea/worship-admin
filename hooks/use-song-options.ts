import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/http/client";
import { queryKeys } from "@/lib/query-keys";
import { hydrateSongOptionSet, type SerializedSongOptionSet } from "@/lib/song-catalog-client";
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

      const optionSet = await getJson<SerializedSongOptionSet>(
        `/api/songs/${songId}/options?${params.toString()}`
      );

      return hydrateSongOptionSet(optionSet);
    },
    enabled: !!songId && !!serviceTypeId,
    staleTime: 5 * 60 * 1000,
  });
}
