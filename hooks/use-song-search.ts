import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/http/client";
import { queryKeys } from "@/lib/query-keys";
import { hydrateSongCatalogEntry, type SerializedSongCatalogEntry } from "@/lib/song-catalog-client";
import type { SongCatalogEntry } from "@/lib/types";

const SONG_SEARCH_STALE_TIME_MS = 5 * 60 * 1000;

export function useSongSearch(
  serviceTypeId: string | null,
  query: string
) {
  const trimmedQuery = query.trim();

  return useQuery<SongCatalogEntry[]>({
    queryKey: queryKeys.songSearch(serviceTypeId, trimmedQuery),
    queryFn: async () => {
      if (!serviceTypeId || !trimmedQuery) return [];

      const params = new URLSearchParams({
        service_type_id: serviceTypeId,
        q: trimmedQuery,
      });

      const songs = await getJson<SerializedSongCatalogEntry[]>(
        `/api/songs/search?${params.toString()}`
      );

      return songs.map(hydrateSongCatalogEntry);
    },
    enabled: !!serviceTypeId && trimmedQuery.length > 0,
    staleTime: SONG_SEARCH_STALE_TIME_MS,
  });
}
