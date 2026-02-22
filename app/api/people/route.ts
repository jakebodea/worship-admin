import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { pcClient, findIncluded } from "@/lib/planning-center";
import { isServiceExcluded } from "@/lib/excluded-services";
import type {
  PersonWithAvailability,
  RawPerson,
  RawBlockout,
  RawPlanPerson,
  RawPlan,
  RawServiceType,
  ServiceHistoryItem,
  Blockout,
  ScheduleFrequency,
} from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Calculate recommendation score based on schedule frequency.
 * Higher score = more recommended to schedule.
 * Prioritizes people with lower frequency (haven't served recently).
 * Penalizes people who already have upcoming services scheduled.
 * @param person - The person to score
 * @param referenceDate - The date to use as reference (plan's service date), defaults to today
 */
function calculateRecommendationScore(
  person: PersonWithAvailability,
  referenceDate: Date = new Date()
): { score: number; reasoning: string[] } {
  const frequency = person.frequency;
  const reasoning: string[] = [];
  
  if (!frequency) {
    reasoning.push("No service history available");
    return { score: 50, reasoning }; // No history = neutral score
  }
  
  // Helper to format dates
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Base score: inverse of past frequency (lower frequency = higher score)
  // Weight recent frequency more heavily (each service in last 30 days = -10 points)
  const baseScore = 100 - (frequency.last30Days * 10);
  
  // Bonus for days since last served (max 30 days = +30 points)
  // People who haven't served in a while get a bonus
  // Only consider PAST services for recency bonus
  const daysSinceLastServed = frequency.lastServedDate
    ? Math.floor((referenceDate.getTime() - frequency.lastServedDate.getTime()) / (1000 * 60 * 60 * 24))
    : 999; // Never served = very high score
  const recencyBonus = Math.min(Math.max(daysSinceLastServed, 0), 30);
  
  // Penalty for upcoming services (each upcoming service = -20 points)
  // People who are already scheduled after this date should be ranked lower
  const upcomingPenalty = (frequency.upcomingServices || 0) * 20;
  
  // Additional penalty if their next service is very close (within 14 days after this date)
  let proximityPenalty = 0;
  if (frequency.nextUpcomingDate) {
    const daysUntilNext = Math.floor(
      (frequency.nextUpcomingDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilNext <= 7) {
      proximityPenalty = 30; // Heavy penalty for service within a week
    } else if (daysUntilNext <= 14) {
      proximityPenalty = 15; // Moderate penalty for service within 2 weeks
    }
  }
  
  const rawScore = baseScore + recencyBonus - upcomingPenalty - proximityPenalty;

  // === Generate reasoning ===
  
  // Past service - include days before
  if (frequency.lastServedDate === undefined && frequency.totalServed === 0) {
    reasoning.push("No past services scheduled");
  } else if (frequency.lastServedDate) {
    const lastServedStr = formatDate(frequency.lastServedDate);
    if (daysSinceLastServed === 0) {
      reasoning.push(`Last served on the same date (${lastServedStr})`);
    } else if (daysSinceLastServed === 1) {
      reasoning.push(`Last served 1 day before on ${lastServedStr}`);
    } else {
      reasoning.push(`Last served ${daysSinceLastServed} days before on ${lastServedStr}`);
    }
  }
  
  // Upcoming service - include days after
  if (frequency.upcomingServices > 0 && frequency.nextUpcomingDate) {
    const nextDateStr = formatDate(frequency.nextUpcomingDate);
    const daysUntilNext = Math.floor(
      (frequency.nextUpcomingDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (frequency.upcomingServices === 1) {
      if (daysUntilNext === 1) {
        reasoning.push(`Upcoming: 1 day after on ${nextDateStr}`);
      } else {
        reasoning.push(`Upcoming: ${daysUntilNext} days after on ${nextDateStr}`);
      }
    } else {
      reasoning.push(`Upcoming: ${frequency.upcomingServices} days scheduled (${daysUntilNext} days after on ${nextDateStr})`);
    }
  }
  
  // Only add score-impacting explanations for significant factors
  
  // Penalty: upcoming service close
  if (frequency.upcomingServices > 0 && frequency.nextUpcomingDate) {
    const daysUntilNext = Math.floor(
      (frequency.nextUpcomingDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilNext <= 7) {
      reasoning.push(`Ranked lower: scheduled ${daysUntilNext} day${daysUntilNext === 1 ? '' : 's'} after`);
    } else if (daysUntilNext <= 14) {
      reasoning.push(`Ranked slightly lower: scheduled ${daysUntilNext} days after`);
    } else if (daysUntilNext <= 21) {
      reasoning.push(`Minor penalty: scheduled ${daysUntilNext} days after`);
    }
  }
  
  // Penalty: high recent frequency (3+ days in last 30 days)
  if (frequency.last30Days >= 3) {
    reasoning.push(`Ranked lower: served ${frequency.last30Days} days in the last 30 days`);
  }
  
  return { score: rawScore, reasoning };
}

export async function GET(request: Request) {
  const log = logger.withRequest(request);
  log.info("Request started");

  try {
    const { searchParams } = new URL(request.url);
    const positionId = searchParams.get("position_id");
    const serviceTypeId = searchParams.get("service_type_id");
    const dateStr = searchParams.get("date");

    // Require both service_type_id and position_id for documented assignment route
    if (!positionId || !serviceTypeId) {
      log.info("Missing position_id or service_type_id, returning empty");
      return NextResponse.json([]);
    }

    // Parse date if provided (this is the plan's service date)
    const checkDate = dateStr ? new Date(dateStr) : null;

    // Step 1: Get assignments for this position and include person resources
    const { data: assignmentsData, included: assignmentsIncluded } =
      await pcClient.getPeopleForTeamPosition(
      serviceTypeId,
      positionId
    );

    const personResources: RawPerson[] = [];
    const seenPersonIds = new Set<string>();

    for (const assignment of assignmentsData) {
      const personRel = assignment.relationships?.person?.data;
      const personId = Array.isArray(personRel)
        ? personRel[0]?.id
        : personRel?.id;

      if (!personId || seenPersonIds.has(personId)) {
        continue;
      }

      const person = findIncluded(
        assignmentsIncluded,
        "Person",
        personId
      ) as unknown as RawPerson | undefined;

      if (person) {
        seenPersonIds.add(personId);
        personResources.push(person);
      }
    }

    // Filter out archived people early
    const activePersonResources = personResources.filter(
      (person) => !person.attributes.archived_at
    );

    // Fetch service type names once for response enrichment
    const serviceTypes = await pcClient.getServiceTypesCached();
    const serviceTypeNameById = new Map<string, string>();
    serviceTypes.forEach((st) => {
      if (st.type === "ServiceType") {
        const typed = st as unknown as RawServiceType;
        serviceTypeNameById.set(typed.id, (typed.attributes.name as string) || "");
      }
    });

    // Step 2 & 3: Check blockouts and get service history for each person
    const peopleWithData = await Promise.all(
      activePersonResources.map(async (rawPerson) => {
        const person = rawPerson as unknown as RawPerson;
        const referenceDate = checkDate || new Date();

        // Transform to Person type
        const transformedPerson: PersonWithAvailability = {
          id: person.id,
          firstName: (person.attributes.first_name as string) || "",
          lastName: (person.attributes.last_name as string) || "",
          fullName: `${person.attributes.first_name || ""} ${person.attributes.last_name || ""}`.trim(),
          photoUrl: (person.attributes.photo_url as string) || null,
          photoThumbnailUrl:
            (person.attributes.photo_thumbnail_url as string) || null,
          archived: !!person.attributes.archived_at,
          positions: [],
        };

        // Start blockouts fetch immediately so it can run in parallel with history fetch.
        const blockoutsPromise: Promise<Blockout[]> = checkDate
          ? pcClient
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

        // Step 3: Get service history (last 90 days) for ANY position
        // This endpoint already returns history across all positions, which is what we want
        let serviceHistory: ServiceHistoryItem[] = [];
        try {
          const historyResponse = await pcClient.getPersonPlanPeopleWithPlans(
            person.id,
            {},
            2
          );

          const planPeople = historyResponse.data as unknown as RawPlanPerson[];
          const historyIncluded = historyResponse.included || [];

          // Filter out plan_people that belong to excluded service types
          const filteredPlanPeople = planPeople.filter((pp) => {
            const planId = pp.relationships?.plan?.data;
            if (planId) {
              const planIdStr = Array.isArray(planId)
                ? planId[0]?.id
                : planId?.id;
              if (planIdStr) {
                const plan = findIncluded(
                  historyIncluded,
                  "Plan",
                  planIdStr
                ) as unknown as RawPlan | undefined;

                if (plan?.relationships?.service_type?.data) {
                  const stData = plan.relationships.service_type.data;
                  const stId = Array.isArray(stData)
                    ? stData[0]?.id
                    : stData?.id;
                  if (stId && isServiceExcluded(stId)) {
                    return false; // Exclude this plan_person
                  }
                }
              }
            }
            return true; // Include if we can't determine service type or it's not excluded
          });

          serviceHistory = filteredPlanPeople.map((pp) => {
            const planId = pp.relationships?.plan?.data;
            let plan: RawPlan | undefined;
            let serviceTypeName: string | undefined;

            if (planId) {
              const planIdStr = Array.isArray(planId)
                ? planId[0]?.id
                : planId?.id;
              if (planIdStr) {
                plan = findIncluded(
                  historyIncluded,
                  "Plan",
                  planIdStr
                ) as unknown as RawPlan | undefined;

                if (plan?.relationships?.service_type?.data) {
                  const stData = plan.relationships.service_type.data;
                  const stId = Array.isArray(stData)
                    ? stData[0]?.id
                    : stData?.id;
                  if (stId) serviceTypeName = serviceTypeNameById.get(stId);
                }
              }
            }

            // Extract team name from team_position_name (format: "Team Name - Position Name")
            const teamPositionParts = (
              pp.attributes.team_position_name as string
            ).split(" - ");
            const teamName =
              teamPositionParts.length > 1 ? teamPositionParts[0] : undefined;
            const positionName =
              teamPositionParts.length > 1
                ? teamPositionParts[1]
                : teamPositionParts[0];

            // Use plan's sort_date (service date) instead of PlanPerson's created_at (scheduling date)
            // Fallback to created_at if sort_date is not available
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
          });

          // Keep only relevant range in-memory (without relying on undocumented filters)
          serviceHistory = serviceHistory.filter((item) => {
            const daysDiff = Math.floor(
              (referenceDate.getTime() - item.date.getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return daysDiff <= 90;
          });

          // Sort by service date ascending (oldest first)
          serviceHistory.sort((a, b) => {
            return a.date.getTime() - b.date.getTime();
          });

          // Calculate frequency metrics from ALL service history (before slicing for display)
          const frequency: ScheduleFrequency = {
            last30Days: 0,
            last60Days: 0,
            last90Days: 0,
            totalServed: 0,
            upcomingServices: 0,
          };

          // Helper to normalize a date to just the day (remove time component)
          const normalizeToDay = (date: Date): string => {
            const normalized = new Date(date);
            normalized.setHours(0, 0, 0, 0);
            return normalized.toISOString().split('T')[0]; // YYYY-MM-DD format
          };

          // Track unique service dates (not individual service items)
          // This ensures multiple positions on the same day count as one day
          const pastServiceDates = new Set<string>();
          const futureServiceDates = new Set<string>();
          const pastServices: ServiceHistoryItem[] = [];
          const futureServices: ServiceHistoryItem[] = [];
          
          serviceHistory.forEach((historyItem) => {
            const daysDiff = Math.floor(
              (referenceDate.getTime() - historyItem.date.getTime()) / (1000 * 60 * 60 * 24)
            );

            const serviceDateKey = normalizeToDay(historyItem.date);

            if (daysDiff >= 0) {
              // Past service (on or before the plan date)
              // Only count unique dates, not individual service items
              if (!pastServiceDates.has(serviceDateKey)) {
                pastServiceDates.add(serviceDateKey);
                if (daysDiff <= 30) frequency.last30Days++;
                if (daysDiff <= 60) frequency.last60Days++;
                if (daysDiff <= 90) frequency.last90Days++;
              }
              pastServices.push(historyItem);
            } else {
              // Future service (after the plan date)
              // Only count unique dates, not individual service items
              if (!futureServiceDates.has(serviceDateKey)) {
                futureServiceDates.add(serviceDateKey);
                frequency.upcomingServices++;
              }
              futureServices.push(historyItem);
            }
          });

          // totalServed should count unique days, not individual service items
          frequency.totalServed = pastServiceDates.size;

          // Get the most recent PAST service date
          if (pastServices.length > 0) {
            // Past services are sorted ascending, so last item is most recent past service
            frequency.lastServedDate = pastServices[pastServices.length - 1].date;
          }

          // Get the next UPCOMING service date
          if (futureServices.length > 0) {
            // Future services are sorted ascending, so first item is next upcoming
            frequency.nextUpcomingDate = futureServices[0].date;
          }

          transformedPerson.frequency = frequency;

          // Show only the 4 most recent service histories for display (last 4 after sorting ascending)
          serviceHistory = serviceHistory.slice(-4);
        } catch {
          // Set default frequency if there's an error
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
              (blockout) =>
                checkDate >= blockout.startsAt && checkDate <= blockout.endsAt
            )
          : false;

        transformedPerson.isBlockedForDate = isBlocked;
        transformedPerson.blockouts = blockouts;
        transformedPerson.availability = isBlocked ? "blocked" : "available";
        transformedPerson.serviceHistory = serviceHistory;

        return transformedPerson;
      })
    );
    
    // Step 4: Calculate recommendation scores, normalize to 0-100, and sort
    // Calculate raw recommendation scores for each person
    // Use the plan's service date as reference for scoring
    const scoringReferenceDate = checkDate || new Date();
    peopleWithData.forEach((person) => {
      const { score, reasoning } = calculateRecommendationScore(person, scoringReferenceDate);
      person.recommendationScore = score;
      person.recommendationReasoning = reasoning;
    });

    // Find min and max scores for normalization (excluding blocked people from normalization)
    const availablePeopleScores = peopleWithData
      .filter(p => !p.isBlockedForDate && p.recommendationScore !== undefined)
      .map(p => p.recommendationScore!);
    
    const minScore = availablePeopleScores.length > 0 ? Math.min(...availablePeopleScores) : 0;
    const maxScore = availablePeopleScores.length > 0 ? Math.max(...availablePeopleScores) : 100;
    const scoreRange = maxScore - minScore;

    // Normalize scores to 0-100 range
    peopleWithData.forEach((person) => {
      if (person.recommendationScore !== undefined && !person.isBlockedForDate) {
        const rawScore = person.recommendationScore;
        // Normalize: (score - min) / range * 100
        // Handle edge case where all scores are the same (range = 0)
        const normalizedScore = scoreRange > 0 
          ? ((rawScore - minScore) / scoreRange) * 100
          : 50; // If all scores are the same, set to middle value
        person.recommendationScore = Math.round(normalizedScore * 100) / 100; // Round to 2 decimal places
      }
    });

    // Sort: available first, then by recommendation score (highest first), then alphabetically
    peopleWithData.sort((a, b) => {
      // Blocked people always go last
      if (a.isBlockedForDate && !b.isBlockedForDate) return 1;
      if (!a.isBlockedForDate && b.isBlockedForDate) return -1;

      // Sort by recommendation score (descending - highest score first)
      const aScore = a.recommendationScore || 0;
      const bScore = b.recommendationScore || 0;
      const scoreDiff = bScore - aScore;
      if (scoreDiff !== 0) return scoreDiff;

      // Tiebreaker: alphabetical
      return a.fullName.localeCompare(b.fullName);
    });

    log.info(
      { positionId, serviceTypeId, date: dateStr ?? null, count: peopleWithData.length },
      "People fetched"
    );
    return NextResponse.json(peopleWithData);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    log.error({ err }, "Failed to fetch people");
    return NextResponse.json(
      { error: "Failed to fetch people", details: err.message },
      { status: 500 }
    );
  }
}
