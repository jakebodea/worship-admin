import { findIncluded } from "@/lib/planning-center/utils";
import { isServiceExcluded } from "@/lib/excluded-services";
import type {
  PCResource,
  RawPlan,
  RawPlanPerson,
  RawPlanTime,
  RawSchedule,
  RawTeam,
  ScheduleFrequency,
  ServiceHistoryItem,
} from "@/lib/types";
import { findMatchingScheduleForSelectedPosition } from "@/lib/use-cases/planning-center/people/matching";
import type {
  HistoryBuildResult,
  SelectedPlanMatchContext,
} from "@/lib/use-cases/planning-center/people/types";
import { getDefaultFrequency } from "@/lib/use-cases/planning-center/people/transforms";

type HistoryTimeType = "service" | "rehearsal" | "other";

function getRelationshipIds(
  relationship:
    | { data?: { id: string } | { id: string }[] | null }
    | undefined
): string[] {
  const data = relationship?.data;
  if (!data) return [];
  return Array.isArray(data) ? data.map((item) => item.id) : [data.id];
}

function classifyScheduleTimeType(
  schedule: RawSchedule,
  historyIncluded: PCResource[]
): HistoryTimeType | undefined {
  const planTimeIds = [
    ...getRelationshipIds(schedule.relationships?.plan_times),
    ...getRelationshipIds(schedule.relationships?.times),
  ];

  const uniquePlanTimeIds = [...new Set(planTimeIds)];
  if (uniquePlanTimeIds.length > 0) {
    const timeTypes = uniquePlanTimeIds
      .map((id) => findIncluded(historyIncluded, "PlanTime", id) as RawPlanTime | undefined)
      .map((planTime) => planTime?.attributes.time_type)
      .filter((value): value is string => typeof value === "string");

    if (timeTypes.includes("service")) return "service";
    if (timeTypes.includes("rehearsal")) return "rehearsal";
    if (timeTypes.includes("other")) return "other";
  }

  const teamRel = schedule.relationships?.team?.data;
  const teamId = Array.isArray(teamRel) ? teamRel[0]?.id : teamRel?.id;
  if (teamId) {
    const team = findIncluded(historyIncluded, "Team", teamId) as RawTeam | undefined;
    if (team?.attributes.rehearsal_team) return "rehearsal";
  }

  return undefined;
}

function getSchedulePlanTimes(
  schedule: RawSchedule,
  historyIncluded: PCResource[]
): RawPlanTime[] {
  const planTimeIds = [
    ...getRelationshipIds(schedule.relationships?.plan_times),
    ...getRelationshipIds(schedule.relationships?.times),
  ];

  return [...new Set(planTimeIds)]
    .map((id) => findIncluded(historyIncluded, "PlanTime", id) as RawPlanTime | undefined)
    .filter((planTime): planTime is RawPlanTime => !!planTime);
}

function filterExcludedSchedules(
  schedules: RawSchedule[],
  historyIncluded: PCResource[]
): RawSchedule[] {
  return schedules.filter((schedule) => {
    const stRel = schedule.relationships?.service_type?.data;
    const stId = Array.isArray(stRel) ? stRel[0]?.id : stRel?.id;
    if (stId) {
      return !isServiceExcluded(stId);
    }

    const planRel = schedule.relationships?.plan?.data;
    const planId = Array.isArray(planRel) ? planRel[0]?.id : planRel?.id;
    if (!planId) return true;

    const plan = findIncluded(historyIncluded, "Plan", planId) as RawPlan | undefined;
    const planStRel = plan?.relationships?.service_type?.data;
    const planStId = Array.isArray(planStRel) ? planStRel[0]?.id : planStRel?.id;
    return !(planStId && isServiceExcluded(planStId));
  });
}

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
  planTimeById: Map<string, RawPlanTime> = new Map()
): ServiceHistoryItem[] {
  return planPeople.flatMap((pp) => {
    const planRel = pp.relationships?.plan?.data;
    const planId = Array.isArray(planRel) ? planRel[0]?.id : planRel?.id;
    const plan = planId
      ? (findIncluded(historyIncluded, "Plan", planId) as RawPlan | undefined)
      : undefined;

    const fallbackDate = plan?.attributes.sort_date
      ? new Date(plan.attributes.sort_date as string)
      : new Date(pp.attributes.created_at as string);

    const teamPositionParts = ((pp.attributes.team_position_name as string) || "").split(" - ");
    const teamName = teamPositionParts.length > 1 ? teamPositionParts[0] : undefined;
    const positionName =
      teamPositionParts.length > 1 ? teamPositionParts.slice(1).join(" - ") : teamPositionParts[0];

    const buildItem = (
      id: string,
      date: Date,
      timeType: HistoryTimeType | undefined
    ): ServiceHistoryItem => ({
      id,
      sourceScheduleId: pp.id,
      date,
      teamPositionName: positionName || "",
      teamName,
      serviceTypeName: undefined,
      planTitle: (plan?.attributes.title as string | undefined) || undefined,
      status: (pp.attributes.status as string) || "",
      timeType,
    });

    const timesIds = new Set(getRelationshipIds(pp.relationships?.times));
    const serviceTimesIds = new Set(getRelationshipIds(pp.relationships?.service_times));

    if (timesIds.size === 0 && serviceTimesIds.size === 0) {
      return [buildItem(pp.id, fallbackDate, "service")];
    }

    const serviceRows = [...serviceTimesIds].map((planTimeId) => {
      const planTime = planTimeById.get(planTimeId);
      const date = planTime?.attributes.starts_at
        ? new Date(planTime.attributes.starts_at as string)
        : fallbackDate;
      return buildItem(
        `${pp.id}:${planTimeId}`,
        date,
        planTime?.attributes.time_type === "service" ? "service" : "service"
      );
    });

    const rehearsalCandidateIds = [...timesIds].filter((id) => !serviceTimesIds.has(id));
    const rehearsalRows = rehearsalCandidateIds.map((planTimeId) => {
      const planTime = planTimeById.get(planTimeId);
      const rawType = planTime?.attributes.time_type;
      const inferredType: HistoryTimeType =
        rawType === "other" ? "other" : rawType === "service" ? "service" : "rehearsal";
      const date = planTime?.attributes.starts_at
        ? new Date(planTime.attributes.starts_at as string)
        : fallbackDate;
      return buildItem(`${pp.id}:${planTimeId}`, date, inferredType);
    });

    const rows = [...serviceRows, ...rehearsalRows].filter(
      (item) => item.timeType === "service" || item.timeType === "rehearsal"
    );

    return rows.length > 0 ? rows : [buildItem(pp.id, fallbackDate, "service")];
  });
}

function mapSchedulesToServiceHistory(
  schedules: RawSchedule[],
  historyIncluded: PCResource[]
): ServiceHistoryItem[] {
  return schedules.flatMap((schedule) => {
      const planRel = schedule.relationships?.plan?.data;
      const planId = Array.isArray(planRel) ? planRel[0]?.id : planRel?.id;
      const plan = planId
        ? (findIncluded(historyIncluded, "Plan", planId) as RawPlan | undefined)
        : undefined;

      const fallbackSortDate =
        (schedule.attributes.sort_date as string | undefined) ??
        (plan?.attributes.sort_date as string | undefined);
      const planTimes = getSchedulePlanTimes(schedule, historyIncluded);

      const buildItem = (
        id: string,
        date: Date,
        timeType: HistoryTimeType | undefined
      ): ServiceHistoryItem => ({
        id,
        sourceScheduleId: schedule.id,
        date,
        teamPositionName: (schedule.attributes.team_position_name as string) || "",
        teamName: (schedule.attributes.team_name as string | undefined) || undefined,
        serviceTypeName:
          (schedule.attributes.service_type_name as string | undefined) || undefined,
        planTitle: (plan?.attributes.title as string | undefined) || undefined,
        status: (schedule.attributes.status as string) || "",
        timeType,
      });

      if (planTimes.length === 0) {
        const date = fallbackSortDate ? new Date(fallbackSortDate) : new Date();
        return [buildItem(schedule.id, date, classifyScheduleTimeType(schedule, historyIncluded))];
      }

      const items = planTimes.map((planTime) => {
        const timeTypeRaw = planTime.attributes.time_type;
        const timeType: HistoryTimeType | undefined =
          timeTypeRaw === "service" || timeTypeRaw === "rehearsal" || timeTypeRaw === "other"
            ? timeTypeRaw
            : undefined;
        const dateString =
          (planTime.attributes.starts_at as string | undefined) ?? fallbackSortDate;
        const date = dateString ? new Date(dateString) : new Date();
        return buildItem(`${schedule.id}:${planTime.id}`, date, timeType);
      });

      // If all included plan times are "other", keep one fallback row so history still shows the assignment.
      const hasServiceOrRehearsal = items.some(
        (item) => item.timeType === "service" || item.timeType === "rehearsal"
      );
      if (!hasServiceOrRehearsal) {
        const date = fallbackSortDate ? new Date(fallbackSortDate) : new Date();
        return [buildItem(schedule.id, date, classifyScheduleTimeType(schedule, historyIncluded))];
      }

      return items.filter(
        (item) => item.timeType === "service" || item.timeType === "rehearsal"
      );
    });
}

function isServiceEngagement(item: ServiceHistoryItem) {
  return item.timeType === undefined || item.timeType === "service";
}

function isRehearsalEngagement(item: ServiceHistoryItem) {
  return item.timeType === "rehearsal";
}

export function buildFrequencyFromServiceHistory(
  serviceHistory: ServiceHistoryItem[],
  referenceDate: Date
): ScheduleFrequency {
  const frequency = getDefaultFrequency();
  const pastServiceDates = new Set<string>();
  const futureServiceDates = new Set<string>();
  const pastRehearsalOnlyDates = new Set<string>();
  const futureRehearsalOnlyDates = new Set<string>();
  const pastServices: ServiceHistoryItem[] = [];
  const futureServices: ServiceHistoryItem[] = [];
  const pastRehearsalOnlyItems: ServiceHistoryItem[] = [];
  const futureRehearsalOnlyItems: ServiceHistoryItem[] = [];

  const dayFlags = new Map<
    string,
    { hasService: boolean; hasRehearsal: boolean; mostRecentService?: ServiceHistoryItem; mostRecentRehearsal?: ServiceHistoryItem }
  >();

  for (const historyItem of serviceHistory) {
    const normalized = new Date(historyItem.date);
    normalized.setHours(0, 0, 0, 0);
    const dayKey = normalized.toISOString().split("T")[0];

    const serviceEngagement = isServiceEngagement(historyItem);
    const rehearsalEngagement = isRehearsalEngagement(historyItem);

    const entry = dayFlags.get(dayKey) || { hasService: false, hasRehearsal: false };
    if (serviceEngagement) {
      entry.hasService = true;
      if (!entry.mostRecentService || historyItem.date > entry.mostRecentService.date) {
        entry.mostRecentService = historyItem;
      }
    }
    if (rehearsalEngagement) {
      entry.hasRehearsal = true;
      if (!entry.mostRecentRehearsal || historyItem.date > entry.mostRecentRehearsal.date) {
        entry.mostRecentRehearsal = historyItem;
      }
    }
    dayFlags.set(dayKey, entry);
  }

  for (const [dayKey, flags] of dayFlags) {
    const dayDate = new Date(`${dayKey}T00:00:00.000Z`);
    const daysDiff = Math.floor(
      (referenceDate.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff >= 0) {
      if (flags.hasService) {
        if (!pastServiceDates.has(dayKey)) {
          pastServiceDates.add(dayKey);
          if (daysDiff <= 30) frequency.last30Days++;
          if (daysDiff <= 60) frequency.last60Days++;
          if (daysDiff <= 90) frequency.last90Days++;
        }
        if (flags.mostRecentService) pastServices.push(flags.mostRecentService);
      }

      if (flags.hasRehearsal && !flags.hasService) {
        if (!pastRehearsalOnlyDates.has(dayKey)) {
          pastRehearsalOnlyDates.add(dayKey);
          if (daysDiff <= 30) frequency.rehearsalLast30Days++;
          if (daysDiff <= 60) frequency.rehearsalLast60Days++;
          if (daysDiff <= 90) frequency.rehearsalLast90Days++;
        }
        if (flags.mostRecentRehearsal) pastRehearsalOnlyItems.push(flags.mostRecentRehearsal);
      }
    } else {
      if (flags.hasService) {
        if (!futureServiceDates.has(dayKey)) {
          futureServiceDates.add(dayKey);
          frequency.upcomingServices++;
        }
        if (flags.mostRecentService) futureServices.push(flags.mostRecentService);
      }

      if (flags.hasRehearsal && !flags.hasService) {
        if (!futureRehearsalOnlyDates.has(dayKey)) {
          futureRehearsalOnlyDates.add(dayKey);
          frequency.upcomingRehearsals++;
        }
        if (flags.mostRecentRehearsal) futureRehearsalOnlyItems.push(flags.mostRecentRehearsal);
      }
    }
  }

  frequency.totalServed = pastServiceDates.size;
  frequency.totalRehearsals = pastRehearsalOnlyDates.size;

  if (pastServices.length > 0) {
    frequency.lastServedDate = pastServices[pastServices.length - 1].date;
  }
  if (futureServices.length > 0) {
    frequency.nextUpcomingDate = futureServices[0].date;
  }
  if (pastRehearsalOnlyItems.length > 0) {
    frequency.lastRehearsalDate =
      pastRehearsalOnlyItems[pastRehearsalOnlyItems.length - 1].date;
  }
  if (futureRehearsalOnlyItems.length > 0) {
    frequency.nextRehearsalDate = futureRehearsalOnlyItems[0].date;
  }

  return frequency;
}

export function buildHistoryAndFrequencyForPerson(
  schedules: RawSchedule[],
  historyIncluded: PCResource[],
  referenceDate: Date,
  selectedMatchContext: SelectedPlanMatchContext,
  historyLimit: number = 4
): HistoryBuildResult {
  const filteredSchedules = filterExcludedSchedules(schedules, historyIncluded);
  let serviceHistory = mapSchedulesToServiceHistory(
    filteredSchedules,
    historyIncluded
  );

  const matchedSchedule = findMatchingScheduleForSelectedPosition(
    filteredSchedules,
    selectedMatchContext
  );

  serviceHistory.sort((a, b) => a.date.getTime() - b.date.getTime());
  const frequency = buildFrequencyFromServiceHistory(serviceHistory, referenceDate);
  serviceHistory = serviceHistory.filter((item) => {
    const daysDiff = Math.floor(
      (referenceDate.getTime() - item.date.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff >= -14 && daysDiff <= 14;
  });
  if (Number.isFinite(historyLimit)) {
    serviceHistory =
      historyLimit <= 0 ? [] : serviceHistory.slice(-Math.floor(historyLimit));
  }

  return { serviceHistory, frequency, matchedSchedule };
}

export function buildHistoryAndFrequencyForPlanPeople(
  planPeople: RawPlanPerson[],
  historyIncluded: PCResource[],
  referenceDate: Date,
  selectedMatchContext: SelectedPlanMatchContext,
  planTimeById: Map<string, RawPlanTime> = new Map(),
  historyLimit: number = 4
): HistoryBuildResult {
  const filteredPlanPeople = filterExcludedPlanPeople(planPeople, historyIncluded);
  let serviceHistory = mapPlanPeopleToServiceHistory(
    filteredPlanPeople,
    historyIncluded,
    planTimeById
  );

  const matchedSchedule = findMatchingScheduleForSelectedPosition(
    filteredPlanPeople,
    selectedMatchContext
  );

  serviceHistory.sort((a, b) => a.date.getTime() - b.date.getTime());
  const frequency = buildFrequencyFromServiceHistory(serviceHistory, referenceDate);
  serviceHistory = serviceHistory.filter((item) => {
    const daysDiff = Math.floor(
      (referenceDate.getTime() - item.date.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff >= -14 && daysDiff <= 14;
  });

  if (Number.isFinite(historyLimit)) {
    serviceHistory = historyLimit <= 0 ? [] : serviceHistory.slice(-Math.floor(historyLimit));
  }

  return { serviceHistory, frequency, matchedSchedule };
}
