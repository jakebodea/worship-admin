import type { PCResource } from "@/lib/types";
import { logger } from "@/lib/logger";
import { PlanningCenterCoreClient } from "@/lib/planning-center/core-client";
import { formatCalendarDayInTimeZone } from "@/lib/planning-center/org-calendar";
import { resolveOrganizationTimeZone } from "@/lib/planning-center/resolve-organization-timezone";
import { PlanningCenterReadCache, stableParams } from "@/lib/planning-center/services/read-cache";

const log = logger.for("planning-center/plans");
const PLANS_RANGE_CACHE_TTL_MS = 5 * 60 * 1000;

export class PlanningCenterPlansService {
  private readonly cache = new PlanningCenterReadCache();

  constructor(private readonly core: PlanningCenterCoreClient) {}

  async getPlans(
    serviceTypeId: string,
    params: Record<string, string> = {}
  ): Promise<PCResource[]> {
    return this.core.fetchAll<PCResource>(
      `/services/v2/service_types/${serviceTypeId}/plans`,
      { ...params, order: "-sort_date" },
      3
    );
  }

  /**
   * Fetch plans from `afterDayKey` onward (YYYY-MM-DD in org TZ) via filter=after.
   * Trims to plans whose sort_date falls on [`afterDayKey`, `beforeDayKey`] in the org timezone.
   */
  async getPlansInDateRange(
    serviceTypeId: string,
    afterDayKey: string,
    beforeDayKey: string
  ): Promise<PCResource[]> {
    const response = await this.getPlansWithIncludedInDateRange(
      serviceTypeId,
      afterDayKey,
      beforeDayKey
    );
    return response.data;
  }

  async getPlansWithIncludedInDateRange(
    serviceTypeId: string,
    afterDayKey: string,
    beforeDayKey: string,
    include: string = ""
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const orgTz = await resolveOrganizationTimeZone();
    const params = {
      order: "sort_date",
      per_page: "100",
      filter: "after",
      after: afterDayKey,
      ...(include ? { include } : {}),
    };
    const cacheKey = [
      this.core.getCacheScope(),
      "plans-range",
      encodeURIComponent(serviceTypeId),
      encodeURIComponent(afterDayKey),
      encodeURIComponent(beforeDayKey),
      stableParams(params),
    ].join(":");

    const response = await this.cache.get(cacheKey, PLANS_RANGE_CACHE_TTL_MS, async () => {
      log.info(
        { serviceTypeId, after: afterDayKey, before: beforeDayKey, include: include || null },
        "Fetching plans in date range"
      );

      const response = await this.core.fetchAllWithIncluded<PCResource>(
        `/services/v2/service_types/${serviceTypeId}/plans`,
        params,
        3
      );

      const plans = response.data.filter((plan) => {
        const sortDateStr = plan.attributes.sort_date as string | undefined;
        if (!sortDateStr) return false;
        const sortDate = new Date(sortDateStr);
        if (Number.isNaN(sortDate.getTime())) return false;
        const planDay = formatCalendarDayInTimeZone(sortDate, orgTz);
        return planDay >= afterDayKey && planDay <= beforeDayKey;
      });

      const planIds = new Set(plans.map((plan) => plan.id));
      const included = response.included.filter((resource) => {
        const planRel = resource.relationships?.plan?.data;
        const planId = Array.isArray(planRel) ? planRel[0]?.id : planRel?.id;
        return !planId || planIds.has(planId);
      });

      log.info(
        {
          serviceTypeId,
          count: plans.length,
          rawCount: response.data.length,
          includedCount: included.length,
        },
        "Plans fetched"
      );
      return { data: plans, included };
    });

    return cloneResourceResponse(response);
  }

  async getPlan(planId: string): Promise<PCResource> {
    const response = await this.core.fetch<PCResource>(`/services/v2/plans/${planId}`);
    return response.data;
  }

  async getPlanForServiceTypeWithSeries(
    serviceTypeId: string,
    planId: string
  ): Promise<{ data: PCResource; included: PCResource[] }> {
    const response = await this.core.fetch<PCResource>(
      `/services/v2/service_types/${serviceTypeId}/plans/${planId}?include=series`
    );
    return {
      data: response.data,
      included: response.included || [],
    };
  }
}

function cloneResourceResponse(response: {
  data: PCResource[];
  included: PCResource[];
}): { data: PCResource[]; included: PCResource[] } {
  return {
    data: structuredClone(response.data),
    included: structuredClone(response.included),
  };
}

export const planningCenterPlansService = new PlanningCenterPlansService(
  new PlanningCenterCoreClient()
);
