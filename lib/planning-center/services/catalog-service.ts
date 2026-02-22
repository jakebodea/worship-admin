import type { PCResource } from "@/lib/types";
import { PlanningCenterCoreClient } from "@/lib/planning-center/core-client";

export class PlanningCenterCatalogService {
  private serviceTypesCache: { expiresAt: number; data: PCResource[] } | null =
    null;

  constructor(private readonly core: PlanningCenterCoreClient) {}

  async getTeams(params: Record<string, string> = {}): Promise<PCResource[]> {
    return this.core.fetchAll<PCResource>("/services/v2/teams", params);
  }

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

  async getServiceTypeTeamPositions(serviceTypeId: string): Promise<PCResource[]> {
    return this.core.fetchAll<PCResource>(
      `/services/v2/service_types/${serviceTypeId}/team_positions?include=team`
    );
  }

  async getServiceTypeTeamPositionsWithTeams(
    serviceTypeId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const response = await this.core.fetch<PCResource[]>(
      `/services/v2/service_types/${serviceTypeId}/team_positions?include=team`
    );

    return {
      data: Array.isArray(response.data) ? response.data : [response.data],
      included: response.included || [],
    };
  }
}

export const planningCenterCatalogService = new PlanningCenterCatalogService(
  new PlanningCenterCoreClient()
);
