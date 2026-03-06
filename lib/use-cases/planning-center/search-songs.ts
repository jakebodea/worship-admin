import { planningCenterSongsService } from "@/lib/planning-center/services/songs-service";
import type { SongCatalogEntry } from "@/lib/types";
import {
  normalizeSongCatalogEntry,
  scoreSongSearch,
} from "@/lib/use-cases/planning-center/plan-items-shared";

const MAX_RESULTS = 24;

export async function searchSongs(
  cacheKey: string,
  serviceTypeId: string,
  query: string
): Promise<SongCatalogEntry[]> {
  if (!query.trim()) return [];

  const catalog = await planningCenterSongsService.getSongsCatalogCached(`${cacheKey}:${serviceTypeId}`);
  const normalized = catalog
    .map((song) => normalizeSongCatalogEntry(song))
    .filter((song) => !song.hidden)
    .map((song) => ({
      ...song,
      matchScore: scoreSongSearch(song, query),
    }))
    .filter((song) => (song.matchScore ?? 0) > 0)
    .toSorted((a, b) => {
      const scoreDiff = (b.matchScore ?? 0) - (a.matchScore ?? 0);
      if (scoreDiff !== 0) return scoreDiff;

      return a.title.localeCompare(b.title);
    });

  return normalized.slice(0, MAX_RESULTS);
}
