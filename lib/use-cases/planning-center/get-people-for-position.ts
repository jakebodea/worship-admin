import { formatCalendarDayInTimeZone } from "@/lib/planning-center/org-calendar";
import { resolveOrganizationTimeZone } from "@/lib/planning-center/resolve-organization-timezone";
import { PlanningCenterReadCache } from "@/lib/planning-center/services/read-cache";
import { planningCenterPeopleService } from "@/lib/planning-center/services/people-service";
import {
  type PersonWithAvailability,
  type RawSchedule,
  type ScheduleFrequency,
  type ServiceHistoryItem,
} from "@/lib/types";
import {
  applySelectedPlanStatus,
  findMatchingScheduleForSelectedPosition,
  getSelectedPlanAssignmentLabels,
} from "@/lib/use-cases/planning-center/people/matching";
import {
  buildHistoryAndFrequencyForPerson,
} from "@/lib/use-cases/planning-center/people/history";
import {
  emptyPlanSchedulingContext,
  getPlanSchedulingContext,
} from "@/lib/use-cases/planning-center/plan-scheduling-context";
import {
  applySelectedPlanRosterStatus,
  getSelectedPlanRosterOverlay,
  mergeAssignedAndSelectedPlanSlotPeople,
  mergeAssignmentLabels,
} from "@/lib/use-cases/planning-center/people/roster-overlay";
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

/** Per-person hydration (schedules + blockouts) is Planning Center I/O-bound; keep bursts below the API window. */
const PEOPLE_HYDRATION_CONCURRENCY = 4;
const CANDIDATE_HISTORY_CACHE_TTL_MS = 60 * 1000;
const candidateHistoryCache = new PlanningCenterReadCache();

interface CandidateHistorySnapshot {
  schedules: RawSchedule[];
  frequency: ScheduleFrequency;
  serviceHistory: ServiceHistoryItem[];
}

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

  const [orgTimeZone, assignmentsResponse, planSchedulingContext] = await Promise.all([
    resolveOrganizationTimeZone(),
    planningCenterPeopleService.getPeopleForTeamPosition(serviceTypeId, positionId),
    planId
      ? getPlanSchedulingContext({ serviceTypeId, planId }).catch(() =>
          emptyPlanSchedulingContext(serviceTypeId, planId)
        )
      : Promise.resolve(emptyPlanSchedulingContext(serviceTypeId, "")),
  ]);

  const { data: assignmentsData, included: assignmentsIncluded } = assignmentsResponse;

  const assignedPeople = getAssignedPeopleFromAssignments(assignmentsData, assignmentsIncluded);
  const selectedMatchContext = buildSelectedPlanMatchContext(
    assignmentsIncluded,
    positionId,
    teamId,
    planId
  );
  const activePeople = mergeAssignedAndSelectedPlanSlotPeople({
    assignedPeople,
    planSchedulingContext,
    selectedMatchContext,
  }).filter((person) => !person.attributes.archived_at);
  const peopleWithData = await mapWithConcurrency(
    activePeople,
    PEOPLE_HYDRATION_CONCURRENCY,
    async (rawPerson): Promise<PersonWithAvailability> => {
      const person = createBasePerson(rawPerson);
      const blockoutsPromise = buildBlockoutsPromise(rawPerson.id, planSortAt);
      const rosterOverlay = getSelectedPlanRosterOverlay(
        planSchedulingContext,
        rawPerson.id,
        selectedMatchContext
      );

      try {
        const historySnapshot = await getCandidateHistorySnapshot(
          rawPerson.id,
          referenceDate,
          orgTimeZone
        );

        person.frequency = historySnapshot.frequency;
        person.serviceHistory = historySnapshot.serviceHistory;
        const scheduleLabels = getSelectedPlanAssignmentLabels(
          historySnapshot.schedules,
          selectedMatchContext
        );
        const combinedLabels = mergeAssignmentLabels(
          rosterOverlay.assignmentLabels,
          scheduleLabels
        );

        if (rosterOverlay.selectedSlotEntry) {
          applySelectedPlanRosterStatus(person, rosterOverlay, combinedLabels);
        } else {
          applySelectedPlanStatus(
            person,
            findMatchingScheduleForSelectedPosition(
              historySnapshot.schedules,
              selectedMatchContext
            ),
            combinedLabels
          );
        }
      } catch {
        person.frequency = getDefaultFrequency();
        person.serviceHistory = [];
        applySelectedPlanRosterStatus(person, rosterOverlay);
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

async function getCandidateHistorySnapshot(
  personId: string,
  referenceDate: Date,
  orgTimeZone: string
): Promise<CandidateHistorySnapshot> {
  const refDayKey = formatCalendarDayInTimeZone(referenceDate, orgTimeZone);
  const cacheKey = [
    planningCenterPeopleService.getCacheScope(),
    "candidate-history",
    encodeURIComponent(personId),
    encodeURIComponent(orgTimeZone),
    refDayKey,
  ].join(":");

  return candidateHistoryCache.get(cacheKey, CANDIDATE_HISTORY_CACHE_TTL_MS, async () => {
    const scheduleResponse = await planningCenterPeopleService.getPersonSchedules(
      personId,
      { order: "-starts_at" },
      2
    );
    const schedules = scheduleResponse.data as unknown as RawSchedule[];
    const historyResult = buildHistoryAndFrequencyForPerson(
      schedules,
      scheduleResponse.included || [],
      referenceDate,
      {},
      Number.POSITIVE_INFINITY,
      orgTimeZone
    );

    return {
      schedules,
      frequency: historyResult.frequency,
      serviceHistory: historyResult.serviceHistory,
    };
  });
}

export function invalidateCandidateHistoryForPerson(personId: string) {
  const scope = planningCenterPeopleService.getCacheScope();
  const prefix = [
    scope,
    "candidate-history",
    encodeURIComponent(personId),
    "",
  ].join(":");

  candidateHistoryCache.deleteWhere((key) => key.startsWith(prefix));
}
