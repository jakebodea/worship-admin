import type { PCResource } from "@/lib/types";
import { logger } from "@/lib/logger";
import { PlanningCenterCoreClient } from "@/lib/planning-center/core-client";

const log = logger.for("planning-center/catalog");

export class PlanningCenterCatalogService {
  private serviceTypesCache: { expiresAt: number; data: PCResource[] } | null =
    null;

  constructor(private readonly core: PlanningCenterCoreClient) {}

  async getTeam(teamId: string): Promise<PCResource> {
    const response = await this.core.fetch<PCResource>(`/services/v2/teams/${teamId}`);
    return response.data;
  }

  async getServiceTypes(
    params: Record<string, string> = {}
  ): Promise<PCResource[]> {
    return this.core.fetchAll<PCResource>("/services/v2/service_types", params);
  }

  async getServiceTypesCached(
    ttlMs: number = 5 * 60 * 1000
  ): Promise<PCResource[]> {
    const now = Date.now();
    if (this.serviceTypesCache && this.serviceTypesCache.expiresAt > now) {
      return this.serviceTypesCache.data;
    }

    const data = await this.getServiceTypes();
    this.serviceTypesCache = {
      expiresAt: now + ttlMs,
      data,
    };
    return data;
  }

  async getServiceTypeTeamPositionsWithTeams(
    serviceTypeId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const response = await this.core.fetch<PCResource[]>(
      `/services/v2/service_types/${serviceTypeId}/team_positions?include=team`
    );

    const data = Array.isArray(response.data) ? response.data : [response.data];
    log.info(
      { serviceTypeId, positionCount: data.length },
      "Team positions fetched"
    );

    return {
      data,
      included: response.included || [],
    };
  }

  async getPlanNeededPositionsWithTeams(
    seriesId: string,
    planId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const response = await this.core.fetchAllWithIncluded<PCResource>(
      `/services/v2/series/${seriesId}/plans/${planId}/needed_positions`,
      { include: "team" }
    );

    log.info(
      { seriesId, planId, neededPositionCount: response.data.length },
      "Plan needed positions fetched"
    );

    return response;
  }

  async getServiceTypePlanNeededPositionsWithTeams(
    serviceTypeId: string,
    planId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const response = await this.core.fetchAllWithIncluded<PCResource>(
      `/services/v2/service_types/${serviceTypeId}/plans/${planId}/needed_positions`,
      { include: "team" }
    );

    log.info(
      { serviceTypeId, planId, neededPositionCount: response.data.length },
      "Service type plan needed positions fetched"
    );

    return response;
  }
}

export const planningCenterCatalogService = new PlanningCenterCatalogService(
  new PlanningCenterCoreClient()
);
