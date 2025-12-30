import { NextResponse } from "next/server";
import { pcClient, findIncluded } from "@/lib/planning-center";
import { isServiceExcluded } from "@/lib/excluded-services";
import type {
  PersonWithAvailability,
  RawPerson,
  RawTeamPosition,
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
 */
function calculateRecommendationScore(person: PersonWithAvailability, logDetails: boolean = false): number {
  const frequency = person.frequency;
  
  if (!frequency) {
    if (logDetails) {
      console.log(`[SCORE] ${person.fullName}: No frequency data - returning neutral score 50`);
    }
    return 50; // No history = neutral score
  }
  
  // Base score: inverse of frequency (lower frequency = higher score)
  // Weight recent frequency more heavily (each service in last 30 days = -10 points)
  const baseScore = 100 - (frequency.last30Days * 10);
  
  // Bonus for days since last served (max 30 days = +30 points)
  // People who haven't served in a while get a bonus
  const daysSinceLastServed = frequency.lastServedDate
    ? Math.floor((Date.now() - frequency.lastServedDate.getTime()) / (1000 * 60 * 60 * 24))
    : 999; // Never served = very high score
  const recencyBonus = Math.min(daysSinceLastServed, 30);
  
  const rawScore = baseScore + recencyBonus;
  
  if (logDetails) {
    console.log(`[SCORE] ${person.fullName}:`, {
      last30Days: frequency.last30Days,
      last60Days: frequency.last60Days,
      last90Days: frequency.last90Days,
      totalServed: frequency.totalServed,
      daysSinceLastServed: frequency.lastServedDate ? daysSinceLastServed : 'never',
      baseScore: `${100} - (${frequency.last30Days} × 10) = ${baseScore}`,
      recencyBonus: `min(${daysSinceLastServed}, 30) = ${recencyBonus}`,
      rawScore: `${baseScore} + ${recencyBonus} = ${rawScore}`,
    });
  }
  
  return rawScore;
}

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("plan_id");
    const positionId = searchParams.get("position_id");
    const teamId = searchParams.get("team_id");
    const dateStr = searchParams.get("date");

    console.log(`[API /people] Starting request for team_id: ${teamId}, position_id: ${positionId}, plan_id: ${planId}, date: ${dateStr}`);

    // Require both team_id and position_id for optimized query
    if (!positionId || !teamId) {
      console.log(`[API /people] Missing required params - returning empty array`);
      return NextResponse.json([]);
    }

    // Parse date if provided
    const checkDate = dateStr ? new Date(dateStr) : null;
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Step 1: Get ONLY people who can serve in this position (optimized endpoint)
    console.log(`[API /people] Step 1: Fetching people for team_position...`);
    const step1Start = Date.now();
    const { data: peopleData, included } = await pcClient.getPeopleForTeamPosition(
      teamId,
      positionId
    );
    const step1Duration = Date.now() - step1Start;
    console.log(`[API /people] Step 1: Received ${peopleData.length} people, ${included.length} included resources (took ${step1Duration}ms)`);
    
    // The endpoint returns Person resources directly in the data array (not PersonTeamPositionAssignment)
    // So we can use the data array directly as Person resources
    const personResources: RawPerson[] = peopleData
      .filter((item) => item.type === "Person")
      .map((item) => item as unknown as RawPerson);

    // Filter out archived people early
    const activePersonResources = personResources.filter(
      (person) => !person.attributes.archived_at
    );

    console.log(`[API /people] Found ${personResources.length} people total, ${activePersonResources.length} active (non-archived)`);

    // Step 2 & 3: Check blockouts and get service history for each person
    console.log(`[API /people] Step 2 & 3: Processing ${activePersonResources.length} people (checking blockouts and service history)...`);
    const step2Start = Date.now();
    
    const peopleWithData = await Promise.all(
      activePersonResources.map(async (rawPerson) => {
        const person = rawPerson as unknown as RawPerson;

        // Get all team position assignments for this person to populate positions array
        let positions: Array<{ id: string; name: string; teamId: string }> = [];
        try {
          const assignmentsResponse =
            await pcClient.getPersonTeamPositionAssignments(person.id);

          // Extract team positions from included resources
          const teamPositions = assignmentsResponse.included.filter(
            (item) => item.type === "TeamPosition"
          );

          positions = teamPositions.map((tp) => {
            const pos = tp as unknown as RawTeamPosition;
            const teamData = pos.relationships?.team?.data;
            let teamId = "";

            if (teamData) {
              teamId = Array.isArray(teamData)
                ? teamData[0]?.id || ""
                : teamData.id || "";
            }

            if (!teamId) {
              const team = assignmentsResponse.included.find(
                (item) => item.type === "Team"
              );
              teamId = team?.id || "";
            }

            return {
              id: pos.id,
              name: (pos.attributes.name as string) || "",
              teamId,
            };
          });
        } catch (error) {
          console.warn(
            `Failed to get positions for person ${person.id}:`,
            error
          );
        }

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
          positions,
        };

        // Step 2: Check blockouts for the selected date
        let isBlocked = false;
        let blockouts: Blockout[] = [];
        if (checkDate) {
          try {
            const rawBlockouts = await pcClient.getPersonBlockouts(person.id);
            blockouts = rawBlockouts.map((raw) => {
              const blockout = raw as unknown as RawBlockout;
              return {
                id: blockout.id,
                reason: blockout.attributes.reason || "",
                startsAt: new Date(blockout.attributes.starts_at as string),
                endsAt: new Date(blockout.attributes.ends_at as string),
                description: blockout.attributes.description || "",
                share: blockout.attributes.share,
              };
            });

            // Check if person is blocked for the selected date
            isBlocked = blockouts.some((blockout) => {
              return (
                checkDate >= blockout.startsAt && checkDate <= blockout.endsAt
              );
            });
          } catch (error) {
            console.warn(
              `Failed to get blockouts for person ${person.id}:`,
              error
            );
          }
        }

        transformedPerson.isBlockedForDate = isBlocked;
        transformedPerson.blockouts = blockouts;
        transformedPerson.availability = isBlocked ? "blocked" : "available";

        // Step 3: Get service history (last 90 days) for ANY position
        // This endpoint already returns history across all positions, which is what we want
        let serviceHistory: ServiceHistoryItem[] = [];
        try {
          const historyResponse =
            await pcClient.getPersonPlanPeopleWithPlans(person.id, {
              "filter[after]": ninetyDaysAgo.toISOString().split("T")[0],
              order: "-created_at",
            });

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
            let serviceType: RawServiceType | undefined;

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
                  if (stId) {
                    serviceType = findIncluded(
                      historyIncluded,
                      "ServiceType",
                      stId
                    ) as unknown as RawServiceType | undefined;
                  }
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
              serviceTypeName: serviceType?.attributes.name as
                | string
                | undefined,
              planTitle: plan?.attributes.title as string | undefined,
              status: pp.attributes.status as string,
            };
          });

          // Sort by service date ascending (oldest first)
          serviceHistory.sort((a, b) => {
            return a.date.getTime() - b.date.getTime();
          });

          // Calculate frequency metrics from ALL service history (before slicing for display)
          const now = new Date();
          const frequency: ScheduleFrequency = {
            last30Days: 0,
            last60Days: 0,
            last90Days: 0,
            totalServed: serviceHistory.length,
          };

          // Count services in different time windows
          serviceHistory.forEach((historyItem) => {
            const daysAgo = Math.floor(
              (now.getTime() - historyItem.date.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysAgo <= 30) frequency.last30Days++;
            if (daysAgo <= 60) frequency.last60Days++;
            if (daysAgo <= 90) frequency.last90Days++;
          });

          // Get the most recent service date
          if (serviceHistory.length > 0) {
            // Service history is sorted ascending, so last item is most recent
            frequency.lastServedDate = serviceHistory[serviceHistory.length - 1].date;
          }

          transformedPerson.frequency = frequency;

          // Show only the 4 most recent service histories for display (last 4 after sorting ascending)
          serviceHistory = serviceHistory.slice(-4);
        } catch (error) {
          console.warn(
            `Failed to get service history for person ${person.id}:`,
            error
          );
          // Set default frequency if there's an error
          transformedPerson.frequency = {
            last30Days: 0,
            last60Days: 0,
            last90Days: 0,
            totalServed: 0,
          };
        }

        transformedPerson.serviceHistory = serviceHistory;

        return transformedPerson;
      })
    );
    
    const step2Duration = Date.now() - step2Start;
    const blockedCount = peopleWithData.filter(p => p.isBlockedForDate).length;
    const availableCount = peopleWithData.length - blockedCount;
    console.log(`[API /people] Step 2 & 3: Processed ${peopleWithData.length} people (${availableCount} available, ${blockedCount} blocked) (took ${step2Duration}ms)`);

    // Step 4: Calculate recommendation scores, normalize to 0-100, and sort
    console.log(`[API /people] Step 4: Calculating recommendation scores...`);
    const step4Start = Date.now();
    
    // Calculate raw recommendation scores for each person
    peopleWithData.forEach((person) => {
      person.recommendationScore = calculateRecommendationScore(person, true);
    });

    // Find min and max scores for normalization (excluding blocked people from normalization)
    const availablePeopleScores = peopleWithData
      .filter(p => !p.isBlockedForDate && p.recommendationScore !== undefined)
      .map(p => p.recommendationScore!);
    
    const minScore = availablePeopleScores.length > 0 ? Math.min(...availablePeopleScores) : 0;
    const maxScore = availablePeopleScores.length > 0 ? Math.max(...availablePeopleScores) : 100;
    const scoreRange = maxScore - minScore;

    console.log(`[API /people] Score normalization: min=${minScore}, max=${maxScore}, range=${scoreRange}`);

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
        
        console.log(`[SCORE] ${person.fullName}: Raw=${rawScore.toFixed(2)} → Normalized=${person.recommendationScore.toFixed(2)}%`);
      }
    });

    const step4Duration = Date.now() - step4Start;
    console.log(`[API /people] Step 4: Calculated and normalized scores (took ${step4Duration}ms)`);

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

    const totalDuration = Date.now() - startTime;
    console.log(`[API /people] Returning ${peopleWithData.length} people (${availableCount} available, ${blockedCount} blocked) (took ${totalDuration}ms)`);
    return NextResponse.json(peopleWithData);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API /people] Error after ${duration}ms:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch people", details: errorMessage },
      { status: 500 }
    );
  }
}
