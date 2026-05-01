import type { PCResource } from "@/lib/types";
import { logger } from "@/lib/logger";
import { PlanningCenterCoreClient } from "@/lib/planning-center/core-client";
import { formatCalendarDayInTimeZone } from "@/lib/planning-center/org-calendar";
import { resolveOrganizationTimeZone } from "@/lib/planning-center/resolve-organization-timezone";

const log = logger.for("planning-center/plans");

export class PlanningCenterPlansService {
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
    const orgTz = await resolveOrganizationTimeZone();
    log.info(
      { serviceTypeId, after: afterDayKey, before: beforeDayKey },
      "Fetching plans in date range"
    );

    const rawPlans = await this.core.fetchAll<PCResource>(
      `/services/v2/service_types/${serviceTypeId}/plans`,
      {
        order: "sort_date", // ascending: start date first
        per_page: "100",
        filter: "after",
        after: afterDayKey,
      },
      3
    );

    const plans = rawPlans.filter((plan) => {
      const sortDateStr = plan.attributes.sort_date as string | undefined;
      if (!sortDateStr) return false;
      const sortDate = new Date(sortDateStr);
      if (Number.isNaN(sortDate.getTime())) return false;
      const planDay = formatCalendarDayInTimeZone(sortDate, orgTz);
      return planDay >= afterDayKey && planDay <= beforeDayKey;
    });

    log.info(
      { serviceTypeId, count: plans.length, rawCount: rawPlans.length },
      "Plans fetched"
    );
    return plans;
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

export const planningCenterPlansService = new PlanningCenterPlansService(
  new PlanningCenterCoreClient()
);
