import { planningCenterPeopleService } from "@/lib/planning-center/services/people-service";
import { findIncluded } from "@/lib/planning-center/utils";
import { isServiceExcluded } from "@/lib/excluded-services";
import type { PlanPerson, RawPlan, RawPlanPerson, ScheduleFrequency } from "@/lib/types";

export interface ScheduleHistoryResult {
  planPeople: PlanPerson[];
  frequency: ScheduleFrequency;
}

export async function getScheduleHistory(
  personId: string,
  lookbackDays: number
): Promise<ScheduleHistoryResult> {
  const now = new Date();
  const lookbackStart = new Date(now);
  lookbackStart.setDate(lookbackStart.getDate() - lookbackDays);

  const historyResponse = await planningCenterPeopleService.getPersonPlanPeopleWithPlans(
    personId,
    {},
    3
  );
  const rawPlanPeople = historyResponse.data as unknown as RawPlanPerson[];
  const historyIncluded = historyResponse.included || [];

  const serviceFiltered = rawPlanPeople.filter((pp) => {
    const planId = pp.relationships?.plan?.data;
    if (!planId) return true;
    const planIdStr = Array.isArray(planId) ? planId[0]?.id : planId?.id;
    if (!planIdStr) return true;

    const plan = findIncluded(historyIncluded, "Plan", planIdStr) as
      | RawPlan
      | undefined;
    const stData = plan?.relationships?.service_type?.data;
    const stId = Array.isArray(stData) ? stData[0]?.id : stData?.id;
    return !(stId && isServiceExcluded(stId));
  });

  const confirmed = serviceFiltered.filter((pp) => {
    const status = (pp.attributes.status || "").toString().toLowerCase();
    return status === "confirmed" || status === "c";
  });

  const planPeople: PlanPerson[] = confirmed
    .map((raw) => {
      const pp = raw as unknown as RawPlanPerson;
      const planRel = pp.relationships?.plan?.data;
      const planId = Array.isArray(planRel) ? planRel[0]?.id : planRel?.id;
      const plan = planId
        ? (findIncluded(historyIncluded, "Plan", planId) as RawPlan | undefined)
        : undefined;
      const serviceDate = plan?.attributes.sort_date
        ? new Date(plan.attributes.sort_date)
        : new Date(pp.attributes.created_at);
      return {
        id: pp.id,
        status: pp.attributes.status,
        createdAt: serviceDate,
        teamPositionName: pp.attributes.team_position_name || "",
        planTitle: (plan?.attributes.title as string | undefined) || undefined,
        planDate: serviceDate,
        declineReason: pp.attributes.decline_reason,
      };
    })
    .filter((pp) => pp.createdAt >= lookbackStart);

  planPeople.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const frequency: ScheduleFrequency = {
    last30Days: 0,
    last60Days: 0,
    last90Days: 0,
    totalServed: 0,
    upcomingServices: 0,
  };

  const pastServiceDates = new Set<string>();
  const futureServiceDates = new Set<string>();
  planPeople.forEach((pp) => {
    const normalized = new Date(pp.createdAt);
    normalized.setHours(0, 0, 0, 0);
    const dayKey = normalized.toISOString().split("T")[0];
    const daysAgo = Math.floor((now.getTime() - normalized.getTime()) / (1000 * 60 * 60 * 24));

    if (daysAgo >= 0) {
      if (!pastServiceDates.has(dayKey)) {
        pastServiceDates.add(dayKey);
        if (daysAgo <= 30) frequency.last30Days++;
        if (daysAgo <= 60) frequency.last60Days++;
        if (daysAgo <= 90) frequency.last90Days++;
      }
    } else if (!futureServiceDates.has(dayKey)) {
      futureServiceDates.add(dayKey);
      frequency.upcomingServices++;
    }
  });

  frequency.totalServed = pastServiceDates.size;
  const mostRecentPast = planPeople.find((pp) => pp.createdAt <= now);
  if (mostRecentPast) frequency.lastServedDate = mostRecentPast.createdAt;

  return {
    planPeople: planPeople.slice(0, 20),
    frequency,
  };
}
