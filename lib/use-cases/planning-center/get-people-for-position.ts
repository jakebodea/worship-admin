import { planningCenterPeopleService } from "@/lib/planning-center/services/people-service";
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
  const checkDate = date ? new Date(date) : null;
  const referenceDate = checkDate || new Date();

  const { data: assignmentsData, included: assignmentsIncluded } =
    await planningCenterPeopleService.getPeopleForTeamPosition(serviceTypeId, positionId);

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

  const peopleWithData = await mapWithConcurrency(
    activePeople,
    6,
    async (rawPerson): Promise<PersonWithAvailability> => {
      const person = createBasePerson(rawPerson);
      const blockoutsPromise = buildBlockoutsPromise(rawPerson.id, checkDate);

      try {
        const planPeopleResponse = await planningCenterPeopleService.getPersonPlanPeopleWithPlans(
          rawPerson.id,
          {},
          2
        );
        const planPeople = planPeopleResponse.data as unknown as RawPlanPerson[];
        const historyIncluded = planPeopleResponse.included || [];

        const uniquePlanKeys = new Map<string, { serviceTypeId: string; planId: string }>();
        for (const pp of planPeople) {
          const timesLen = Array.isArray(pp.relationships?.times?.data)
            ? pp.relationships?.times?.data.length
            : 0;
          const serviceTimesLen = Array.isArray(pp.relationships?.service_times?.data)
            ? pp.relationships?.service_times?.data.length
            : 0;
          const couldHaveRehearsalOrOtherTimes = timesLen > serviceTimesLen;
          if (!couldHaveRehearsalOrOtherTimes) continue;

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
          Number.POSITIVE_INFINITY
        );

        person.frequency = historyResult.frequency;
        person.serviceHistory = historyResult.serviceHistory;
        applySelectedPlanStatus(person, historyResult.matchedSchedule);
      } catch {
        person.frequency = getDefaultFrequency();
        person.serviceHistory = [];
      }

      const blockouts = await blockoutsPromise;
      applyAvailability(person, blockouts, checkDate);

      return person;
    }
  );

  scoreAndNormalizePeople(peopleWithData, referenceDate);
  sortPeopleForSelection(peopleWithData);
  return peopleWithData;
}
