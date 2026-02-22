import { planningCenterPeopleService } from "@/lib/planning-center/services/people-service";
import { planningCenterCatalogService } from "@/lib/planning-center/services/catalog-service";
import { findIncluded } from "@/lib/planning-center/utils";
import { isServiceExcluded } from "@/lib/excluded-services";
import {
  type Blockout,
  type PersonWithAvailability,
  type RawBlockout,
  type RawPerson,
  type RawPlan,
  type RawPlanPerson,
  type RawServiceType,
  type ScheduleFrequency,
  type ServiceHistoryItem,
} from "@/lib/types";
import { mapWithConcurrency } from "@/lib/use-cases/planning-center/shared";

interface Params {
  serviceTypeId: string;
  positionId: string;
  date?: string;
}

function calculateRecommendationScore(
  person: PersonWithAvailability,
  referenceDate: Date
): { score: number; reasoning: string[] } {
  const frequency = person.frequency;
  const reasoning: string[] = [];

  if (!frequency) {
    reasoning.push("No service history available");
    return { score: 50, reasoning };
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);

  const baseScore = 100 - frequency.last30Days * 10;
  const daysSinceLastServed = frequency.lastServedDate
    ? Math.floor(
        (referenceDate.getTime() - frequency.lastServedDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 999;
  const recencyBonus = Math.min(Math.max(daysSinceLastServed, 0), 30);
  const upcomingPenalty = (frequency.upcomingServices || 0) * 20;

  let proximityPenalty = 0;
  if (frequency.nextUpcomingDate) {
    const daysUntilNext = Math.floor(
      (frequency.nextUpcomingDate.getTime() - referenceDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (daysUntilNext <= 7) proximityPenalty = 30;
    else if (daysUntilNext <= 14) proximityPenalty = 15;
  }

  const rawScore = baseScore + recencyBonus - upcomingPenalty - proximityPenalty;

  if (frequency.lastServedDate === undefined && frequency.totalServed === 0) {
    reasoning.push("No past services scheduled");
  } else if (frequency.lastServedDate) {
    const lastServedStr = formatDate(frequency.lastServedDate);
    if (daysSinceLastServed === 0) reasoning.push(`Last served on the same date (${lastServedStr})`);
    else if (daysSinceLastServed === 1) reasoning.push(`Last served 1 day before on ${lastServedStr}`);
    else reasoning.push(`Last served ${daysSinceLastServed} days before on ${lastServedStr}`);
  }

  if (frequency.upcomingServices > 0 && frequency.nextUpcomingDate) {
    const nextDateStr = formatDate(frequency.nextUpcomingDate);
    const daysUntilNext = Math.floor(
      (frequency.nextUpcomingDate.getTime() - referenceDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (frequency.upcomingServices === 1) {
      reasoning.push(
        daysUntilNext === 1
          ? `Upcoming: 1 day after on ${nextDateStr}`
          : `Upcoming: ${daysUntilNext} days after on ${nextDateStr}`
      );
    } else {
      reasoning.push(
        `Upcoming: ${frequency.upcomingServices} days scheduled (${daysUntilNext} days after on ${nextDateStr})`
      );
    }

    if (daysUntilNext <= 7) reasoning.push(`Ranked lower: scheduled ${daysUntilNext} day${daysUntilNext === 1 ? "" : "s"} after`);
    else if (daysUntilNext <= 14) reasoning.push(`Ranked slightly lower: scheduled ${daysUntilNext} days after`);
    else if (daysUntilNext <= 21) reasoning.push(`Minor penalty: scheduled ${daysUntilNext} days after`);
  }

  if (frequency.last30Days >= 3) {
    reasoning.push(`Ranked lower: served ${frequency.last30Days} days in the last 30 days`);
  }

  return { score: rawScore, reasoning };
}

export async function getPeopleForPosition({
  serviceTypeId,
  positionId,
  date,
}: Params): Promise<PersonWithAvailability[]> {
  const checkDate = date ? new Date(date) : null;
  const referenceDate = checkDate || new Date();

  const { data: assignmentsData, included: assignmentsIncluded } =
    await planningCenterPeopleService.getPeopleForTeamPosition(
      serviceTypeId,
      positionId
    );

  const personResources: RawPerson[] = [];
  const seenPersonIds = new Set<string>();
  for (const assignment of assignmentsData) {
    const personRel = assignment.relationships?.person?.data;
    const personId = Array.isArray(personRel) ? personRel[0]?.id : personRel?.id;
    if (!personId || seenPersonIds.has(personId)) continue;
    const person = findIncluded(assignmentsIncluded, "Person", personId) as
      | RawPerson
      | undefined;
    if (!person) continue;
    seenPersonIds.add(personId);
    personResources.push(person);
  }

  const activePersonResources = personResources.filter(
    (person) => !person.attributes.archived_at
  );

  const serviceTypes = await planningCenterCatalogService.getServiceTypesCached();
  const serviceTypeNameById = new Map<string, string>();
  serviceTypes.forEach((st) => {
    if (st.type === "ServiceType") {
      const typed = st as unknown as RawServiceType;
      serviceTypeNameById.set(typed.id, (typed.attributes.name as string) || "");
    }
  });

  const peopleWithData = await mapWithConcurrency(
    activePersonResources,
    6,
    async (rawPerson): Promise<PersonWithAvailability> => {
      const person = rawPerson as RawPerson;
      const transformedPerson: PersonWithAvailability = {
        id: person.id,
        firstName: (person.attributes.first_name as string) || "",
        lastName: (person.attributes.last_name as string) || "",
        fullName: `${person.attributes.first_name || ""} ${person.attributes.last_name || ""}`.trim(),
        photoUrl: (person.attributes.photo_url as string) || null,
        photoThumbnailUrl: (person.attributes.photo_thumbnail_url as string) || null,
        archived: !!person.attributes.archived_at,
        positions: [],
      };

      const blockoutsPromise: Promise<Blockout[]> = checkDate
        ? planningCenterPeopleService
            .getPersonBlockouts(person.id)
            .then((rawBlockouts) =>
              rawBlockouts.map((raw) => {
                const blockout = raw as unknown as RawBlockout;
                return {
                  id: blockout.id,
                  reason: blockout.attributes.reason || "",
                  startsAt: new Date(blockout.attributes.starts_at as string),
                  endsAt: new Date(blockout.attributes.ends_at as string),
                  description: blockout.attributes.description || "",
                  share: blockout.attributes.share,
                };
              })
            )
            .catch(() => [])
        : Promise.resolve([]);

      let serviceHistory: ServiceHistoryItem[] = [];
      try {
        const historyResponse =
          await planningCenterPeopleService.getPersonPlanPeopleWithPlans(
            person.id,
            {},
            2
          );
        const planPeople = historyResponse.data as unknown as RawPlanPerson[];
        const historyIncluded = historyResponse.included || [];

        const filteredPlanPeople = planPeople.filter((pp) => {
          const planId = pp.relationships?.plan?.data;
          const planIdStr = Array.isArray(planId) ? planId[0]?.id : planId?.id;
          if (!planIdStr) return true;
          const plan = findIncluded(historyIncluded, "Plan", planIdStr) as
            | RawPlan
            | undefined;
          const stData = plan?.relationships?.service_type?.data;
          const stId = Array.isArray(stData) ? stData[0]?.id : stData?.id;
          return !(stId && isServiceExcluded(stId));
        });

        serviceHistory = filteredPlanPeople
          .map((pp) => {
            const planId = pp.relationships?.plan?.data;
            const planIdStr = Array.isArray(planId) ? planId[0]?.id : planId?.id;
            const plan = planIdStr
              ? (findIncluded(historyIncluded, "Plan", planIdStr) as RawPlan | undefined)
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

        serviceHistory.sort((a, b) => a.date.getTime() - b.date.getTime());

        const frequency: ScheduleFrequency = {
          last30Days: 0,
          last60Days: 0,
          last90Days: 0,
          totalServed: 0,
          upcomingServices: 0,
        };

        const pastServiceDates = new Set<string>();
        const futureServiceDates = new Set<string>();
        const pastServices: ServiceHistoryItem[] = [];
        const futureServices: ServiceHistoryItem[] = [];

        serviceHistory.forEach((historyItem) => {
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
        });

        frequency.totalServed = pastServiceDates.size;
        if (pastServices.length > 0) {
          frequency.lastServedDate = pastServices[pastServices.length - 1].date;
        }
        if (futureServices.length > 0) {
          frequency.nextUpcomingDate = futureServices[0].date;
        }
        transformedPerson.frequency = frequency;
        serviceHistory = serviceHistory.slice(-4);
      } catch {
        transformedPerson.frequency = {
          last30Days: 0,
          last60Days: 0,
          last90Days: 0,
          totalServed: 0,
          upcomingServices: 0,
        };
      }

      const blockouts = await blockoutsPromise;
      const isBlocked = checkDate
        ? blockouts.some(
            (blockout) => checkDate >= blockout.startsAt && checkDate <= blockout.endsAt
          )
        : false;

      transformedPerson.isBlockedForDate = isBlocked;
      transformedPerson.blockouts = blockouts;
      transformedPerson.availability = isBlocked ? "blocked" : "available";
      transformedPerson.serviceHistory = serviceHistory;
      return transformedPerson;
    }
  );

  peopleWithData.forEach((person) => {
    const { score, reasoning } = calculateRecommendationScore(person, referenceDate);
    person.recommendationScore = score;
    person.recommendationReasoning = reasoning;
  });

  const availablePeopleScores = peopleWithData
    .filter((p) => !p.isBlockedForDate && p.recommendationScore !== undefined)
    .map((p) => p.recommendationScore as number);
  const minScore = availablePeopleScores.length > 0 ? Math.min(...availablePeopleScores) : 0;
  const maxScore = availablePeopleScores.length > 0 ? Math.max(...availablePeopleScores) : 100;
  const scoreRange = maxScore - minScore;

  peopleWithData.forEach((person) => {
    if (person.recommendationScore !== undefined && !person.isBlockedForDate) {
      const normalizedScore =
        scoreRange > 0 ? ((person.recommendationScore - minScore) / scoreRange) * 100 : 50;
      person.recommendationScore = Math.round(normalizedScore * 100) / 100;
    }
  });

  peopleWithData.sort((a, b) => {
    if (a.isBlockedForDate && !b.isBlockedForDate) return 1;
    if (!a.isBlockedForDate && b.isBlockedForDate) return -1;

    const aScore = a.recommendationScore || 0;
    const bScore = b.recommendationScore || 0;
    const scoreDiff = bScore - aScore;
    if (scoreDiff !== 0) return scoreDiff;
    return a.fullName.localeCompare(b.fullName);
  });

  return peopleWithData;
}
