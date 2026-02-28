import { PlanningCenterCoreClient } from "@/lib/planning-center/core-client";
import { PlanningCenterCatalogService } from "@/lib/planning-center/services/catalog-service";
import { PlanningCenterPeopleService } from "@/lib/planning-center/services/people-service";
import { PlanningCenterPlansService } from "@/lib/planning-center/services/plans-service";

export function createPlanningCenterServices(accessToken: string) {
  const core = new PlanningCenterCoreClient({
    accessToken,
  });

  return {
    core,
    catalog: new PlanningCenterCatalogService(core),
    people: new PlanningCenterPeopleService(core),
    plans: new PlanningCenterPlansService(core),
  };
}

