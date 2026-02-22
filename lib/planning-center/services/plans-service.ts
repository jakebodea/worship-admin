import type { PCResource } from "@/lib/types";
import { PlanningCenterCoreClient } from "@/lib/planning-center/core-client";

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
}

export const planningCenterPlansService = new PlanningCenterPlansService(
  new PlanningCenterCoreClient()
);
