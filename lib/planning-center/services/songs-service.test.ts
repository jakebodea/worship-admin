import { describe, expect, it, vi } from "vitest";
import {
  PlanningCenterApiError,
  type PlanningCenterCoreClient,
} from "@/lib/planning-center/core-client";
import { PlanningCenterSongsService } from "@/lib/planning-center/services/songs-service";

function createCoreClientMock() {
  return {
    fetch: vi.fn(),
    fetchAll: vi.fn(),
    fetchAllWithIncluded: vi.fn(),
  } as unknown as PlanningCenterCoreClient;
}

describe("PlanningCenterSongsService.getSongLastScheduledItem", () => {
  it("returns null for 404 responses only", async () => {
    const core = createCoreClientMock();
    const fetchMock = vi.mocked(core.fetch);
    fetchMock.mockRejectedValueOnce(
      new PlanningCenterApiError({
        message: "Planning Center API error: 404 - Not found",
        status: 404,
      })
    );

    const service = new PlanningCenterSongsService(core);

    await expect(service.getSongLastScheduledItem("song-1", "service-1")).resolves.toEqual({
      data: null,
      included: [],
    });
  });

  it("rethrows non-404 Planning Center errors", async () => {
    const core = createCoreClientMock();
    const fetchMock = vi.mocked(core.fetch);
    const error = new PlanningCenterApiError({
      message: "Planning Center API error: 500 - Internal error",
      status: 500,
    });
    fetchMock.mockRejectedValueOnce(error);

    const service = new PlanningCenterSongsService(core);

    await expect(service.getSongLastScheduledItem("song-1", "service-1")).rejects.toBe(error);
  });
});
