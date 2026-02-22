import type { PCResource } from "@/lib/types";
import { logger } from "@/lib/logger";
import { PlanningCenterCoreClient } from "@/lib/planning-center/core-client";

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
   * Fetch plans from startDate onward using the API's filter=after param.
   * Per PC API docs: "after — filter to plans with a time beginning after the after parameter"
   * Filters server-side — avoids loading years of past plans. End date capped in memory.
   */
  async getPlansInDateRange(
    serviceTypeId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PCResource[]> {
    const afterParam = startDate.toISOString().split("T")[0];
    const beforeParam = endDate.toISOString().split("T")[0];

    log.info(
      { serviceTypeId, after: afterParam, before: beforeParam },
      "Fetching plans in date range"
    );

    const rawPlans = await this.core.fetchAll<PCResource>(
      `/services/v2/service_types/${serviceTypeId}/plans`,
      {
        order: "sort_date", // ascending: start date first
        per_page: "100",
        filter: "after",
        after: afterParam,
      },
      3
    );

    // Cap at endDate in memory (API may not support before filter; trivial for ~20 plans)
    const endTime = endDate.getTime();
    const plans = rawPlans.filter((plan) => {
      const sortDateStr = plan.attributes.sort_date as string | undefined;
      if (!sortDateStr) return false;
      const sortDate = new Date(sortDateStr);
      return !isNaN(sortDate.getTime()) && sortDate.getTime() <= endTime;
    });

    log.info(
      { serviceTypeId, count: plans.length, rawCount: rawPlans.length },
      "Plans fetched"
    );
    return plans;
  }

  async getPlansNearDate(
    serviceTypeId: string,
    referenceDate: Date,
    pastTarget: number = 5,
    futureTarget: number = 5,
    maxPages: number = 3
  ): Promise<PCResource[]> {
    const allPlans: PCResource[] = [];
    let url = this.core.buildUrl(`/services/v2/service_types/${serviceTypeId}/plans`, {
      order: "-sort_date",
      per_page: "100",
    });
    let pageCount = 0;
    let hasMore = true;

    const todayStart = new Date(referenceDate);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(referenceDate);
    todayEnd.setHours(23, 59, 59, 999);

    while (hasMore && pageCount < maxPages) {
      pageCount++;
      const response = await this.core.fetch<PCResource[] | PCResource>(url);
      const pageData = Array.isArray(response.data) ? response.data : [response.data];
      allPlans.push(...pageData);

      let pastCount = 0;
      let futureCount = 0;
      for (const plan of allPlans) {
        const sortDateRaw = plan.attributes.sort_date as string | undefined;
        if (!sortDateRaw) continue;
        const sortDate = new Date(sortDateRaw);
        if (isNaN(sortDate.getTime())) continue;

        if (sortDate < todayStart) pastCount++;
        else if (sortDate > todayEnd) futureCount++;
      }

      if (pastCount >= pastTarget && futureCount >= futureTarget) {
        break;
      }

      const nextUrl = response.links?.next;
      if (nextUrl && nextUrl !== url) {
        url = nextUrl;
      } else {
        hasMore = false;
      }
    }

    return allPlans;
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
