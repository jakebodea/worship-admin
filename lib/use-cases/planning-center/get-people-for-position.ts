import {
  addCalendarDaysToDayKey,
  formatCalendarDayInTimeZone,
} from "@/lib/planning-center/org-calendar";
import { PLAN_HISTORY_HALF_RANGE_DAYS } from "@/lib/planning-center/schedule-load-constants";
import { resolveOrganizationTimeZone } from "@/lib/planning-center/resolve-organization-timezone";
import { planningCenterCatalogService } from "@/lib/planning-center/services/catalog-service";
import { planningCenterPeopleService } from "@/lib/planning-center/services/people-service";
import { planningCenterPlansService } from "@/lib/planning-center/services/plans-service";
import {
  type PersonWithAvailability,
  type PCResource,
  type RawPlanPerson,
  type RawPlan,
  type RawPlanTime,
} from "@/lib/types";
import { applySelectedPlanStatus } from "@/lib/use-cases/planning-center/people/matching";
import {
  buildHistoryAndFrequencyForPlanPeople,
} from "@/lib/use-cases/planning-center/people/history";
import { scoreAndNormalizePeople, sortPeopleForSelection } from "@/lib/use-cases/planning-center/people/scoring";
import {
  applyAvailability,
  buildBlockoutsPromise,
  buildSelectedPlanMatchContext,
  createBasePerson,
  getAssignedPeopleFromAssignments,
  getDefaultFrequency,
} from "@/lib/use-cases/planning-center/people/transforms";
import { mapWithConcurrency } from "@/lib/use-cases/planning-center/shared";
import { findIncluded } from "@/lib/planning-center/utils";

/** PC team_member pages can be large; cap parallel fetches to reduce 429 risk vs fully unbounded `Promise.all`. */
const TEAM_MEMBERS_PREFETCH_CONCURRENCY = 16;
/** Per-person hydration (plan_people, blockouts, merge) — I/O-bound to Planning Center. */
const PEOPLE_HYDRATION_CONCURRENCY = 10;

interface Params {
  serviceTypeId: string;
  positionId: string;
  teamId?: string;
  planId?: string;
  date?: string;
}

export async function getPeopleForPosition({
  serviceTypeId,
  positionId,
  teamId,
  planId,
  date,
}: Params): Promise<PersonWithAvailability[]> {
  const planSortAt =
    date && !Number.isNaN(new Date(date).getTime()) ? new Date(date) : null;
  const referenceDate = planSortAt ?? new Date();

  const [orgTimeZone, assignmentsResponse, serviceTypes] = await Promise.all([
    resolveOrganizationTimeZone(),
    planningCenterPeopleService.getPeopleForTeamPosition(serviceTypeId, positionId),
    planningCenterCatalogService.getServiceTypesCached(),
  ]);

  const { data: assignmentsData, included: assignmentsIncluded } = assignmentsResponse;

  const assignedPeople = getAssignedPeopleFromAssignments(assignmentsData, assignmentsIncluded);
  const activePeople = assignedPeople.filter((person) => !person.attributes.archived_at);
  const selectedMatchContext = buildSelectedPlanMatchContext(
    assignmentsIncluded,
    positionId,
    teamId,
    planId
  );
  const planTimesCache = new Map<string, Promise<PCResource[]>>();

  const getPlanTimesForPlanCached = (planServiceTypeId: string, planIdValue: string) => {
    const key = `${planServiceTypeId}:${planIdValue}`;
    const existing = planTimesCache.get(key);
    if (existing) return existing;
    const promise = planningCenterPeopleService
      .getPlanTimesForPlan(planServiceTypeId, planIdValue)
      .catch(() => []);
    planTimesCache.set(key, promise);
    return promise;
  };

  const refDayKey = formatCalendarDayInTimeZone(referenceDate, orgTimeZone);
  const historyWindowStart = addCalendarDaysToDayKey(
    refDayKey,
    -PLAN_HISTORY_HALF_RANGE_DAYS,
    orgTimeZone
  );
  const historyWindowEnd = addCalendarDaysToDayKey(
    refDayKey,
    PLAN_HISTORY_HALF_RANGE_DAYS,
    orgTimeZone
  );
  const plansInHistoryWindowByServiceType = new Map<string, PCResource[]>();
  await Promise.all(
    serviceTypes.map(async (st) => {
      const stId = String(st.id);
      const plans = await planningCenterPlansService.getPlansInDateRange(
        stId,
        historyWindowStart,
        historyWindowEnd
      );
      plansInHistoryWindowByServiceType.set(stId, plans);
    })
  );

  const teamMembersByPlanCache = new Map<
    string,
    Promise<{ data: PCResource[]; included: PCResource[] }>
  >();
  function loadTeamMembersForPlan(stId: string, planId: string) {
    const key = `${stId}:${planId}`;
    let promise = teamMembersByPlanCache.get(key);
    if (!promise) {
      promise = planningCenterPeopleService.getPlanTeamMembers(stId, planId);
      teamMembersByPlanCache.set(key, promise);
    }
    return promise;
  }

  const planKeysForTeamPrefetch = [...plansInHistoryWindowByServiceType.entries()].flatMap(
    ([stId, plans]) => plans.map((plan) => [stId, String(plan.id)] as const)
  );
  await mapWithConcurrency(planKeysForTeamPrefetch, TEAM_MEMBERS_PREFETCH_CONCURRENCY, ([stId, pId]) =>
    loadTeamMembersForPlan(stId, pId)
  );

  function mergeIncludedResources(target: PCResource[], extras: PCResource[]) {
    const seen = new Set(target.map((r) => `${r.type}:${r.id}`));
    for (const r of extras) {
      const k = `${r.type}:${r.id}`;
      if (seen.has(k)) continue;
      seen.add(k);
      target.push(r);
    }
  }

  function personIdFromPlanPerson(pp: RawPlanPerson): string | undefined {
    const rel = pp.relationships?.person?.data;
    if (Array.isArray(rel)) return rel[0]?.id;
    if (rel && typeof rel === "object" && "id" in rel) return (rel as { id: string }).id;
    return undefined;
  }

  const peopleWithData = await mapWithConcurrency(
    activePeople,
    PEOPLE_HYDRATION_CONCURRENCY,
    async (rawPerson): Promise<PersonWithAvailability> => {
      const person = createBasePerson(rawPerson);
      const blockoutsPromise = buildBlockoutsPromise(rawPerson.id, planSortAt);

      try {
        const planPeopleResponse = await planningCenterPeopleService.getPersonPlanPeopleWithPlans(
          rawPerson.id,
          {},
          2
        );
        let mergedPlanPeople = planPeopleResponse.data as unknown as RawPlanPerson[];
        let historyIncluded = [...(planPeopleResponse.included || [])];
        const seenPlanPersonIds = new Set(mergedPlanPeople.map((pp) => String(pp.id)));

        for (const [stId, plans] of plansInHistoryWindowByServiceType) {
          for (const plan of plans) {
            const planId = String(plan.id);
            const { data: members, included: memberIncluded } = await loadTeamMembersForPlan(
              stId,
              planId
            );
            mergeIncludedResources(historyIncluded, [plan]);
            mergeIncludedResources(historyIncluded, memberIncluded);

            for (const m of members) {
              const mp = m as unknown as RawPlanPerson;
              if (personIdFromPlanPerson(mp) !== rawPerson.id) continue;
              const mid = String(m.id);
              if (seenPlanPersonIds.has(mid)) continue;
              seenPlanPersonIds.add(mid);
              mergedPlanPeople.push(mp);
            }
          }
        }

        const planPeople = mergedPlanPeople;

        const uniquePlanKeys = new Map<string, { serviceTypeId: string; planId: string }>();
        for (const pp of planPeople) {
          const timesLen = Array.isArray(pp.relationships?.times?.data)
            ? pp.relationships?.times?.data.length
            : 0;
          const serviceTimesLen = Array.isArray(pp.relationships?.service_times?.data)
            ? pp.relationships?.service_times?.data.length
            : 0;
          const couldHaveRehearsalOrOtherTimes = timesLen > serviceTimesLen;
          if (!couldHaveRehearsalOrOtherTimes) {
            continue;
          }

          const planRel = pp.relationships?.plan?.data;
          const ppPlanId = Array.isArray(planRel) ? planRel[0]?.id : planRel?.id;
          if (!ppPlanId) continue;
          const plan = findIncluded(historyIncluded, "Plan", ppPlanId) as RawPlan | undefined;
          const stRel = plan?.relationships?.service_type?.data;
          const ppServiceTypeId = Array.isArray(stRel) ? stRel[0]?.id : stRel?.id;
          if (!ppServiceTypeId) continue;
          uniquePlanKeys.set(`${ppServiceTypeId}:${ppPlanId}`, {
            serviceTypeId: ppServiceTypeId,
            planId: ppPlanId,
          });
        }

        const planTimesLists = await Promise.all(
          [...uniquePlanKeys.values()].map(({ serviceTypeId: stId, planId: pId }) =>
            getPlanTimesForPlanCached(stId, pId)
          )
        );
        const planTimeById = new Map<string, RawPlanTime>();
        for (const list of planTimesLists) {
          for (const resource of list) {
            if (resource.type !== "PlanTime") continue;
            planTimeById.set(resource.id, resource as unknown as RawPlanTime);
          }
        }

        const historyResult = buildHistoryAndFrequencyForPlanPeople(
          planPeople,
          historyIncluded,
          referenceDate,
          selectedMatchContext,
          planTimeById,
          Number.POSITIVE_INFINITY,
          orgTimeZone
        );

        person.frequency = historyResult.frequency;
        person.serviceHistory = historyResult.serviceHistory;
        applySelectedPlanStatus(person, historyResult.matchedSchedule);
      } catch {
        person.frequency = getDefaultFrequency();
        person.serviceHistory = [];
      }

      const blockouts = await blockoutsPromise;
      applyAvailability(person, blockouts, planSortAt);

      return person;
    }
  );

  scoreAndNormalizePeople(peopleWithData, referenceDate, orgTimeZone);
  sortPeopleForSelection(peopleWithData);
  return peopleWithData;
}
