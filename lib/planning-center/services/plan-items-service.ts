import type { PCResource } from "@/lib/types";
import { logger } from "@/lib/logger";
import { PlanningCenterCoreClient } from "@/lib/planning-center/core-client";

const log = logger.for("planning-center/plan-items");

function buildItemPayload(attributes: Record<string, unknown>, id?: string) {
  return {
    data: {
      type: "Item",
      ...(id ? { id } : {}),
      attributes,
    },
  };
}

export class PlanningCenterPlanItemsService {
  constructor(private readonly core: PlanningCenterCoreClient) {}

  async getPlanItems(
    serviceTypeId: string,
    planId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const response = await this.core.fetchAllWithIncluded<PCResource>(
      `/services/v2/service_types/${serviceTypeId}/plans/${planId}/items`,
      {
        include: "song,arrangement,key,item_notes,item_times",
      }
    );

    log.info(
      { serviceTypeId, planId, itemCount: response.data.length },
      "Plan items fetched"
    );

    return response;
  }

  async getPlanItem(
    serviceTypeId: string,
    planId: string,
    itemId: string
  ): Promise<{ data: PCResource; included: PCResource[] }> {
    const response = await this.core.fetch<PCResource>(
      `/services/v2/service_types/${serviceTypeId}/plans/${planId}/items/${itemId}?include=song,arrangement,key,item_notes,item_times`
    );

    return {
      data: response.data,
      included: response.included || [],
    };
  }

  async createPlanItem(
    serviceTypeId: string,
    planId: string,
    attributes: Record<string, unknown>
  ): Promise<{ data: PCResource; included: PCResource[] }> {
    const response = await this.core.fetch<PCResource>(
      `/services/v2/service_types/${serviceTypeId}/plans/${planId}/items?include=song,arrangement,key`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildItemPayload(attributes)),
      }
    );

    return {
      data: response.data,
      included: response.included || [],
    };
  }

  async updatePlanItem(
    serviceTypeId: string,
    planId: string,
    itemId: string,
    attributes: Record<string, unknown>
  ): Promise<{ data: PCResource; included: PCResource[] }> {
    const response = await this.core.fetch<PCResource>(
      `/services/v2/service_types/${serviceTypeId}/plans/${planId}/items/${itemId}?include=song,arrangement,key`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildItemPayload(attributes, itemId)),
      }
    );

    return {
      data: response.data,
      included: response.included || [],
    };
  }

  async deletePlanItem(
    serviceTypeId: string,
    planId: string,
    itemId: string
  ): Promise<void> {
    await this.core.request(
      `/services/v2/service_types/${serviceTypeId}/plans/${planId}/items/${itemId}`,
      {
        method: "DELETE",
      }
    );
  }

  async reorderPlanItems(
    serviceTypeId: string,
    planId: string,
    sequence: string[]
  ): Promise<void> {
    await this.core.request(
      `/services/v2/service_types/${serviceTypeId}/plans/${planId}/item_reorder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            type: "PlanItemReorder",
            attributes: {
              sequence,
            },
          },
        }),
      }
    );
  }
}

export const planningCenterPlanItemsService = new PlanningCenterPlanItemsService(
  new PlanningCenterCoreClient()
);
