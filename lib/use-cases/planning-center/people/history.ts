import { findIncluded } from "@/lib/planning-center/utils";
import { isServiceExcluded } from "@/lib/excluded-services";
import type {
  PCResource,
  RawPlan,
  RawPlanPerson,
  ScheduleFrequency,
  ServiceHistoryItem,
} from "@/lib/types";
import {
  findMatchingPlanPersonForSelectedPosition,
} from "@/lib/use-cases/planning-center/people/matching";
import type {
  HistoryBuildResult,
  SelectedPlanMatchContext,
} from "@/lib/use-cases/planning-center/people/types";
import { getDefaultFrequency } from "@/lib/use-cases/planning-center/people/transforms";

function filterExcludedPlanPeople(
  planPeople: RawPlanPerson[],
  historyIncluded: PCResource[]
): RawPlanPerson[] {
  return planPeople.filter((pp) => {
    const planRel = pp.relationships?.plan?.data;
    const planId = Array.isArray(planRel) ? planRel[0]?.id : planRel?.id;
    if (!planId) return true;

    const plan = findIncluded(historyIncluded, "Plan", planId) as RawPlan | undefined;
    const stData = plan?.relationships?.service_type?.data;
    const stId = Array.isArray(stData) ? stData[0]?.id : stData?.id;
    return !(stId && isServiceExcluded(stId));
  });
}

function mapPlanPeopleToServiceHistory(
  planPeople: RawPlanPerson[],
  historyIncluded: PCResource[],
  serviceTypeNameById: Map<string, string>,
  referenceDate: Date
): ServiceHistoryItem[] {
  return planPeople
    .map((pp) => {
      const planRel = pp.relationships?.plan?.data;
      const planId = Array.isArray(planRel) ? planRel[0]?.id : planRel?.id;
      const plan = planId
        ? (findIncluded(historyIncluded, "Plan", planId) as RawPlan | undefined)
        : undefined;

      const stData = plan?.relationships?.service_type?.data;
      const stId = Array.isArray(stData) ? stData[0]?.id : stData?.id;
      const serviceTypeName = stId ? serviceTypeNameById.get(stId) : undefined;

      const teamPositionParts = (pp.attributes.team_position_name as string).split(" - ");
      const teamName = teamPositionParts.length > 1 ? teamPositionParts[0] : undefined;
      const positionName =
        teamPositionParts.length > 1 ? teamPositionParts[1] : teamPositionParts[0];
      const serviceDate = plan?.attributes.sort_date
        ? new Date(plan.attributes.sort_date as string)
        : new Date(pp.attributes.created_at as string);

      return {
        id: pp.id,
        date: serviceDate,
        teamPositionName: positionName,
        teamName,
        serviceTypeName,
        planTitle: plan?.attributes.title as string | undefined,
        status: pp.attributes.status as string,
      };
    })
    .filter((item) => {
      const daysDiff = Math.floor(
        (referenceDate.getTime() - item.date.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDiff <= 90;
    });
}

function buildFrequencyFromServiceHistory(
  serviceHistory: ServiceHistoryItem[],
  referenceDate: Date
): ScheduleFrequency {
  const frequency = getDefaultFrequency();
  const pastServiceDates = new Set<string>();
  const futureServiceDates = new Set<string>();
  const pastServices: ServiceHistoryItem[] = [];
  const futureServices: ServiceHistoryItem[] = [];

  for (const historyItem of serviceHistory) {
    const daysDiff = Math.floor(
      (referenceDate.getTime() - historyItem.date.getTime()) / (1000 * 60 * 60 * 24)
    );
    const normalized = new Date(historyItem.date);
    normalized.setHours(0, 0, 0, 0);
    const dayKey = normalized.toISOString().split("T")[0];

    if (daysDiff >= 0) {
      if (!pastServiceDates.has(dayKey)) {
        pastServiceDates.add(dayKey);
        if (daysDiff <= 30) frequency.last30Days++;
        if (daysDiff <= 60) frequency.last60Days++;
        if (daysDiff <= 90) frequency.last90Days++;
      }
      pastServices.push(historyItem);
    } else {
      if (!futureServiceDates.has(dayKey)) {
        futureServiceDates.add(dayKey);
        frequency.upcomingServices++;
      }
      futureServices.push(historyItem);
    }
  }

  frequency.totalServed = pastServiceDates.size;
  if (pastServices.length > 0) {
    frequency.lastServedDate = pastServices[pastServices.length - 1].date;
  }
  if (futureServices.length > 0) {
    frequency.nextUpcomingDate = futureServices[0].date;
  }

  return frequency;
}

export function buildHistoryAndFrequencyForPerson(
  planPeople: RawPlanPerson[],
  historyIncluded: PCResource[],
  serviceTypeNameById: Map<string, string>,
  referenceDate: Date,
  selectedMatchContext: SelectedPlanMatchContext
): HistoryBuildResult {
  const filteredPlanPeople = filterExcludedPlanPeople(planPeople, historyIncluded);
  let serviceHistory = mapPlanPeopleToServiceHistory(
    filteredPlanPeople,
    historyIncluded,
    serviceTypeNameById,
    referenceDate
  );

  const matchedPlanPerson = findMatchingPlanPersonForSelectedPosition(
    filteredPlanPeople,
    selectedMatchContext
  );

  serviceHistory.sort((a, b) => a.date.getTime() - b.date.getTime());
  const frequency = buildFrequencyFromServiceHistory(serviceHistory, referenceDate);
  serviceHistory = serviceHistory.slice(-4);

  return { serviceHistory, frequency, matchedPlanPerson };
}

