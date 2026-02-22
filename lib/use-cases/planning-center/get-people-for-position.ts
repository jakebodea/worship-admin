import { planningCenterPeopleService } from "@/lib/planning-center/services/people-service";
import { planningCenterCatalogService } from "@/lib/planning-center/services/catalog-service";
import {
  type PersonWithAvailability,
  type RawPerson,
  type RawPlanPerson,
} from "@/lib/types";
import { applySelectedPlanStatus } from "@/lib/use-cases/planning-center/people/matching";
import { buildHistoryAndFrequencyForPerson } from "@/lib/use-cases/planning-center/people/history";
import { scoreAndNormalizePeople, sortPeopleForSelection } from "@/lib/use-cases/planning-center/people/scoring";
import {
  applyAvailability,
  buildBlockoutsPromise,
  buildSelectedPlanMatchContext,
  buildServiceTypeNameMap,
  createBasePerson,
  getAssignedPeopleFromAssignments,
  getDefaultFrequency,
} from "@/lib/use-cases/planning-center/people/transforms";
import { mapWithConcurrency } from "@/lib/use-cases/planning-center/shared";

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

  const serviceTypes = await planningCenterCatalogService.getServiceTypesCached();
  const serviceTypeNameById = buildServiceTypeNameMap(serviceTypes);

  const peopleWithData = await mapWithConcurrency(
    activePeople,
    6,
    async (rawPerson): Promise<PersonWithAvailability> => {
      const person = createBasePerson(rawPerson);
      const blockoutsPromise = buildBlockoutsPromise(rawPerson.id, checkDate);

      try {
        const historyResponse = await planningCenterPeopleService.getPersonPlanPeopleWithPlans(
          rawPerson.id,
          {},
          2
        );
        const planPeople = historyResponse.data as unknown as RawPlanPerson[];
        const historyIncluded = historyResponse.included || [];

        const historyResult = buildHistoryAndFrequencyForPerson(
          planPeople,
          historyIncluded,
          serviceTypeNameById,
          referenceDate,
          selectedMatchContext
        );

        person.frequency = historyResult.frequency;
        person.serviceHistory = historyResult.serviceHistory;
        applySelectedPlanStatus(person, historyResult.matchedPlanPerson);
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
