import { describe, expect, it, vi } from "vitest";
import { searchSongs } from "@/lib/use-cases/planning-center/search-songs";

const { getSongsCatalogCachedMock } = vi.hoisted(() => ({
  getSongsCatalogCachedMock: vi.fn(),
}));

vi.mock("@/lib/planning-center/services/songs-service", () => ({
  planningCenterSongsService: {
    getSongsCatalogCached: getSongsCatalogCachedMock,
  },
}));

describe("searchSongs", () => {
  it("returns fuzzy-ranked catalog matches and excludes hidden songs", async () => {
    getSongsCatalogCachedMock.mockResolvedValue([
      {
        id: "song-1",
        type: "Song",
        attributes: {
          title: "House of the Lord",
          author: "Phil Wickham",
          hidden: false,
        },
      },
      {
        id: "song-2",
        type: "Song",
        attributes: {
          title: "Lord I Need You",
          author: "Matt Maher",
          hidden: false,
        },
      },
      {
        id: "song-3",
        type: "Song",
        attributes: {
          title: "Archived Song",
          hidden: true,
        },
      },
    ]);

    const songs = await searchSongs("account-1", "service-1", "lord");

    expect(songs.map((song) => song.id)).toEqual(["song-2", "song-1"]);
    expect(songs.some((song) => song.id === "song-3")).toBe(false);
    expect(getSongsCatalogCachedMock).toHaveBeenCalledWith("account-1:service-1");
  });
});
