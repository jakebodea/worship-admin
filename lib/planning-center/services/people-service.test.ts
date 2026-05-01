import { describe, expect, it, vi } from "vitest";
import type { PlanningCenterCoreClient } from "@/lib/planning-center/core-client";
import { PlanningCenterPeopleService } from "@/lib/planning-center/services/people-service";

describe("PlanningCenterPeopleService.getPlanTeamMembers", () => {
  it("uses fetchAllWithIncluded so large rosters are not truncated to the first page", async () => {
    const fetchAllWithIncluded = vi.fn().mockResolvedValue({ data: [], included: [] });
    const core = { fetchAllWithIncluded } as unknown as PlanningCenterCoreClient;
    const service = new PlanningCenterPeopleService(core);

    await service.getPlanTeamMembers("st-123", "plan-456");

    expect(fetchAllWithIncluded).toHaveBeenCalledTimes(1);
    expect(fetchAllWithIncluded).toHaveBeenCalledWith(
      "/services/v2/service_types/st-123/plans/plan-456/team_members",
      { include: "person,team,plan", per_page: "100" },
      25
    );
  });
});
