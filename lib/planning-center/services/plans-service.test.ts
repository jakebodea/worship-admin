import { describe, expect, it, vi } from "vitest";
import type { PlanningCenterCoreClient } from "@/lib/planning-center/core-client";
import { PlanningCenterPlansService } from "@/lib/planning-center/services/plans-service";
import type { PCResource } from "@/lib/types";

vi.mock("@/lib/planning-center/resolve-organization-timezone", () => ({
  resolveOrganizationTimeZone: vi.fn().mockResolvedValue("America/Los_Angeles"),
}));

function planResource(id: string, sortDate: string): PCResource {
  return {
    id,
    type: "Plan",
    attributes: {
      sort_date: sortDate,
    },
  };
}

describe("PlanningCenterPlansService.getPlansWithIncludedInDateRange", () => {
  it("caches range reads and returns mutation-safe copies", async () => {
    const fetchAllWithIncluded = vi.fn().mockResolvedValue({
      data: [
        planResource("plan-1", "2026-05-24T10:00:00-07:00"),
        planResource("plan-2", "2026-06-01T10:00:00-07:00"),
      ],
      included: [
        {
          id: "series-1",
          type: "Series",
          attributes: { title: "Original Series" },
          relationships: {
            plan: { data: { id: "plan-1", type: "Plan" } },
          },
        },
      ],
    });
    const core = {
      fetchAllWithIncluded,
      getCacheScope: () => "test-scope",
    } as unknown as PlanningCenterCoreClient;
    const service = new PlanningCenterPlansService(core);

    const first = await service.getPlansWithIncludedInDateRange(
      "st-1",
      "2026-05-23",
      "2026-06-30",
      "series"
    );
    first.data[0].attributes.sort_date = "mutated";
    first.included[0].attributes.title = "Mutated Series";

    const second = await service.getPlansWithIncludedInDateRange(
      "st-1",
      "2026-05-23",
      "2026-06-30",
      "series"
    );

    expect(fetchAllWithIncluded).toHaveBeenCalledTimes(1);
    expect(second.data[0].attributes.sort_date).toBe("2026-05-24T10:00:00-07:00");
    expect(second.included[0].attributes.title).toBe("Original Series");
  });
});
