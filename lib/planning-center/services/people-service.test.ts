import { describe, expect, it, vi } from "vitest";
import type { PlanningCenterCoreClient } from "@/lib/planning-center/core-client";
import { PlanningCenterPeopleService } from "@/lib/planning-center/services/people-service";

describe("PlanningCenterPeopleService.getPlanTeamMembers", () => {
  it("uses fetchAllWithIncluded so large rosters are not truncated to the first page", async () => {
    const fetchAllWithIncluded = vi.fn().mockResolvedValue({ data: [], included: [] });
    const core = {
      fetchAllWithIncluded,
      getCacheScope: () => "test-scope",
    } as unknown as PlanningCenterCoreClient;
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

describe("PlanningCenterPeopleService.getPlanPlanTimes", () => {
  it("fetches all plan times through the shared cache-backed endpoint", async () => {
    const fetchAll = vi.fn().mockResolvedValue([]);
    const core = {
      fetchAll,
      getCacheScope: () => "test-scope",
    } as unknown as PlanningCenterCoreClient;
    const service = new PlanningCenterPeopleService(core);

    await service.getPlanPlanTimes("plan-456");

    expect(fetchAll).toHaveBeenCalledTimes(1);
    expect(fetchAll).toHaveBeenCalledWith(
      "/services/v2/plans/plan-456/plan_times",
      { per_page: "200" }
    );
  });
});

describe("PlanningCenterPeopleService.deletePlanPerson", () => {
  it("uses the plan team_members endpoint when plan context is available", async () => {
    const request = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const core = {
      request,
      getCacheScope: () => "test-scope",
    } as unknown as PlanningCenterCoreClient;
    const service = new PlanningCenterPeopleService(core);

    await service.deletePlanPerson("pp-123", {
      personId: "person-456",
      serviceTypeId: "st-789",
      planId: "plan-101",
    });

    expect(request).toHaveBeenCalledWith(
      "/services/v2/service_types/st-789/plans/plan-101/team_members/pp-123",
      { method: "DELETE" }
    );
  });

  it("falls back to the person-scoped plan_people endpoint without plan context", async () => {
    const request = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const core = {
      request,
      getCacheScope: () => "test-scope",
    } as unknown as PlanningCenterCoreClient;
    const service = new PlanningCenterPeopleService(core);

    await service.deletePlanPerson("pp-123", {
      personId: "person-456",
    });

    expect(request).toHaveBeenCalledWith(
      "/services/v2/people/person-456/plan_people/pp-123",
      { method: "DELETE" }
    );
  });
});
