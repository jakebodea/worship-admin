import { planningCenterCatalogService } from "@/lib/planning-center/services/catalog-service";
import { planningCenterPeopleService } from "@/lib/planning-center/services/people-service";
import { planningCenterPlansService } from "@/lib/planning-center/services/plans-service";
import { logger } from "@/lib/logger";
import { findAllIncluded, findIncluded } from "@/lib/planning-center/utils";
import type {
  FilledPositionPerson,
  PCResource,
  RawPlan,
  RawPerson,
  RawNeededPosition,
  RawPlanPerson,
  RawTeam,
  RawTeamPosition,
  TeamPosition,
  TeamPositionGroup,
} from "@/lib/types";

const log = logger.for("use-case/get-team-positions");

interface NeededPositionsResolution {
  response: { data: PCResource[]; included: PCResource[] };
  resolvedSeriesId: string | null;
  neededPositionSource: "series-plan" | "service-type-plan";
  usedSeriesFallback: boolean;
}

export async function getNeededTeamPositionsForPlan(
  serviceTypeId: string,
  planId: string,
  seriesId?: string | null
): Promise<TeamPositionGroup[]> {
  log.info(
    { serviceTypeId, planId, providedSeriesId: seriesId ?? null },
    "Fetching needed team positions for plan"
  );

  const [teamPositionResponse, neededPositionsResolution, planTeamMembersResponse] = await Promise.all([
    planningCenterCatalogService.getServiceTypeTeamPositionsWithTeams(serviceTypeId),
    resolveNeededPositions(serviceTypeId, planId, seriesId ?? null),
    planningCenterPeopleService.getPlanTeamMembers(serviceTypeId, planId),
  ]);
  const { response: neededPositionResponse, resolvedSeriesId, neededPositionSource, usedSeriesFallback } =
    neededPositionsResolution;

  const teamPositions = Array.isArray(teamPositionResponse.data)
    ? teamPositionResponse.data
    : [teamPositionResponse.data];
  const teamPositionIncluded = teamPositionResponse.included || [];
  const neededPositions = Array.isArray(neededPositionResponse.data)
    ? neededPositionResponse.data
    : [neededPositionResponse.data];
  const neededIncluded = neededPositionResponse.included || [];
  const planTeamMembers = Array.isArray(planTeamMembersResponse.data)
    ? planTeamMembersResponse.data
    : [planTeamMembersResponse.data];
  const planTeamMembersIncluded = planTeamMembersResponse.included || [];
  const teamMap = new Map<string, TeamPositionGroup>();
  const positionsByTeamAndName = new Map<string, TeamPosition>();

  for (const tp of teamPositions) {
    const position = tp as unknown as RawTeamPosition;
    const { teamId, teamName } = getTeamInfo(position, teamPositionIncluded);
    const positionName = (position.attributes.name as string | undefined)?.trim();
    if (!teamId || !teamName || !positionName) continue;

    const slot: TeamPosition = {
      id: position.id,
      name: positionName,
      teamId,
      teamName,
      neededCount: 0,
    };

    positionsByTeamAndName.set(buildTeamPositionKey(teamId, positionName), slot);
  }

  for (const np of neededPositions) {
    const needed = np as unknown as RawNeededPosition;
    const quantity = needed.attributes.quantity;
    if (typeof quantity === "number" && quantity <= 0) continue;

    const teamData = needed.relationships?.team?.data;
    const teamId =
      !Array.isArray(teamData) && teamData ? teamData.id : "";
    const neededName = (needed.attributes.team_position_name || "").trim();
    if (!teamId || !neededName) continue;

    const matchedPosition = positionsByTeamAndName.get(
      buildTeamPositionKey(teamId, neededName)
    );
    if (!matchedPosition) continue;
    let teamName = matchedPosition.teamName || "";
    if (!teamName) {
      const team = findIncluded(neededIncluded, "Team", teamId) as unknown as RawTeam | undefined;
      if (team) teamName = team.attributes.name as string;
    }
    if (!teamName) {
      const team = findIncluded(teamPositionIncluded, "Team", teamId) as unknown as RawTeam | undefined;
      if (team) teamName = team.attributes.name as string;
    }
    if (!teamName) continue;

    if (!teamMap.has(teamId)) {
      teamMap.set(teamId, { teamId, teamName, positions: [] });
    }

    const group = teamMap.get(teamId)!;
    const existingPosition = group.positions.find((position) => position.id === matchedPosition.id);
    const incrementBy = typeof quantity === "number" && quantity > 0 ? quantity : 1;

    if (existingPosition) {
      existingPosition.neededCount = (existingPosition.neededCount ?? 0) + incrementBy;
      continue;
    }

    matchedPosition.teamName = teamName;
    matchedPosition.neededCount = incrementBy;
    group.positions.push(matchedPosition);
  }

  applyPlanTeamMemberSummary(planTeamMembers, planTeamMembersIncluded, positionsByTeamAndName);
  addFilledPositionsToGroups(teamMap, positionsByTeamAndName);

  const groupedPositions: TeamPositionGroup[] = Array.from(teamMap.values());
  groupedPositions.sort((a, b) => a.teamName.localeCompare(b.teamName));
  groupedPositions.forEach((group) => {
    group.positions.sort((a, b) => a.name.localeCompare(b.name));
  });

  log.info(
    {
      serviceTypeId,
      planId,
      seriesId: resolvedSeriesId ?? null,
      neededPositionSource,
      usedSeriesFallback,
      serviceTypeTeamPositionCount: teamPositions.length,
      neededPositionCount: neededPositions.length,
      planTeamMemberCount: planTeamMembers.length,
      matchedTeamCount: groupedPositions.length,
      matchedPositionCount: groupedPositions.reduce((sum, g) => sum + g.positions.length, 0),
    },
    "Resolved plan needed positions"
  );

  if (groupedPositions.length === 0 && neededPositions.length > 0) {
    const neededSamples = neededPositions.slice(0, 10).map((np) => {
      const needed = np as unknown as RawNeededPosition;
      const teamData = needed.relationships?.team?.data;
      const teamId = !Array.isArray(teamData) && teamData ? teamData.id : null;
      return {
        teamId,
        name: needed.attributes.team_position_name ?? null,
        quantity: needed.attributes.quantity ?? null,
      };
    });
    log.warn(
      { planId, neededSamples },
      "No needed positions matched service type team positions (possible name mismatch)"
    );
  }

  return groupedPositions;
}

function addFilledPositionsToGroups(
  teamMap: Map<string, TeamPositionGroup>,
  positionsByTeamAndName: Map<string, TeamPosition>
) {
  for (const slot of positionsByTeamAndName.values()) {
    const filledCount = (slot.filledConfirmedCount ?? 0) + (slot.filledPendingCount ?? 0);
    if (filledCount === 0) continue;
    if (!slot.teamId || !slot.teamName) continue;

    if (!teamMap.has(slot.teamId)) {
      teamMap.set(slot.teamId, {
        teamId: slot.teamId,
        teamName: slot.teamName,
        positions: [],
      });
    }

    const group = teamMap.get(slot.teamId)!;
    const exists = group.positions.some((position) => position.id === slot.id);
    if (!exists) {
      group.positions.push(slot);
    }
  }
}

function getTeamInfo(
  position: RawTeamPosition,
  included: PCResource[]
): { teamId: string; teamName: string } {
  let teamId = "";
  let teamName = "";

  if (position.relationships?.team?.data) {
    const teamData = position.relationships.team.data;
    teamId = Array.isArray(teamData) ? teamData[0]?.id || "" : teamData?.id || "";
  }

  if (teamId) {
    const team = findIncluded(included, "Team", teamId) as unknown as RawTeam | undefined;
    if (team) teamName = team.attributes.name as string;
  }

  if (!teamId || !teamName) {
    const teams = findAllIncluded(included, "Team");
    if (teams.length > 0) {
      const team = teams[0] as unknown as RawTeam;
      teamId = team.id;
      teamName = team.attributes.name as string;
    }
  }

  return { teamId, teamName };
}

function buildTeamPositionKey(teamId: string, positionName: string): string {
  return `${teamId}::${positionName.trim().toLowerCase()}`;
}

function applyPlanTeamMemberSummary(
  rawPlanTeamMembers: PCResource[],
  included: PCResource[],
  positionsByTeamAndName: Map<string, TeamPosition>
) {
  const personInfoById = buildPersonInfoMap(included);

  for (const raw of rawPlanTeamMembers) {
    const planPerson = raw as unknown as RawPlanPerson;
    const status = classifyPlanPersonStatus(planPerson.attributes.status);
    if (!status) continue;

    const slotKey = getPlanPersonSlotKey(planPerson, positionsByTeamAndName, included);
    if (!slotKey) continue;

    const slot = positionsByTeamAndName.get(slotKey);
    if (!slot) continue;

    if (status === "confirmed") {
      slot.filledConfirmedCount = (slot.filledConfirmedCount ?? 0) + 1;
    } else {
      slot.filledPendingCount = (slot.filledPendingCount ?? 0) + 1;
    }

    const personId = getPlanPersonId(planPerson) ?? `unknown-${planPerson.id}`;
    const personInfo = personId ? personInfoById.get(personId) : undefined;
    const entry: FilledPositionPerson = {
      id: personId,
      name: personInfo?.name || "Unknown person",
      status,
      rawStatus: (planPerson.attributes.status || "").toString(),
      photoThumbnailUrl: personInfo?.photoThumbnailUrl ?? null,
    };

    if (!slot.filledPeople) {
      slot.filledPeople = [entry];
    } else {
      slot.filledPeople.push(entry);
    }
  }

  for (const slot of positionsByTeamAndName.values()) {
    if (!slot.filledPeople || slot.filledPeople.length === 0) continue;
    slot.filledPeople.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "confirmed" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }
}

function buildPersonInfoMap(
  included: PCResource[]
): Map<string, { name: string; photoThumbnailUrl: string | null }> {
  const result = new Map<string, { name: string; photoThumbnailUrl: string | null }>();

  for (const resource of included) {
    if (resource.type !== "Person") continue;
    const person = resource as unknown as RawPerson;
    const firstName = (person.attributes.first_name || "").trim();
    const lastName = (person.attributes.last_name || "").trim();
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || "Unknown person";
    result.set(resource.id, {
      name: fullName,
      photoThumbnailUrl: person.attributes.photo_thumbnail_url ?? null,
    });
  }

  return result;
}

function classifyPlanPersonStatus(rawStatus: string | undefined): "confirmed" | "pending" | null {
  const status = (rawStatus || "").trim().toLowerCase();
  if (!status) return "pending";
  if (status === "c" || status === "confirmed") return "confirmed";
  if (
    status === "d" ||
    status.includes("declined") ||
    status.includes("removed")
  ) {
    return null;
  }
  return "pending";
}

function getPlanPersonId(planPerson: RawPlanPerson): string | null {
  const personRel = planPerson.relationships?.person?.data;
  if (!personRel || Array.isArray(personRel)) return null;
  return personRel.id || null;
}

function getPlanPersonSlotKey(
  planPerson: RawPlanPerson,
  positionsByTeamAndName: Map<string, TeamPosition>,
  included: PCResource[]
): string | null {
  const teamId = getPlanPersonTeamId(planPerson);
  const teamPositionName = (planPerson.attributes.team_position_name || "").trim();
  if (!teamPositionName) return null;

  if (teamId) {
    const directKey = buildTeamPositionKey(teamId, teamPositionName);
    if (positionsByTeamAndName.has(directKey)) return directKey;

    const parsed = parseTeamAndPosition(teamPositionName);
    if (parsed) {
      const byParsedPosition = buildTeamPositionKey(teamId, parsed.positionName);
      if (positionsByTeamAndName.has(byParsedPosition)) return byParsedPosition;
    }
  }

  const parsed = parseTeamAndPosition(teamPositionName);
  if (!parsed) return null;

  const parsedTeamId = findTeamIdByName(included, parsed.teamName);
  if (!parsedTeamId) return null;

  const key = buildTeamPositionKey(parsedTeamId, parsed.positionName);
  return positionsByTeamAndName.has(key) ? key : null;
}

function getPlanPersonTeamId(planPerson: RawPlanPerson): string | null {
  const teamRel = planPerson.relationships?.team?.data;
  if (!teamRel || Array.isArray(teamRel)) return null;
  return teamRel.id || null;
}

function parseTeamAndPosition(
  teamPositionName: string
): { teamName: string; positionName: string } | null {
  if (!teamPositionName.includes(" - ")) return null;
  const parts = teamPositionName.split(" - ");
  const teamName = (parts[0] || "").trim();
  const positionName = parts.slice(1).join(" - ").trim();
  if (!teamName || !positionName) return null;
  return { teamName, positionName };
}

function findTeamIdByName(included: PCResource[], teamName: string): string | null {
  const normalized = teamName.trim().toLowerCase();
  if (!normalized) return null;

  const team = included.find((resource) => {
    if (resource.type !== "Team") return false;
    const rawTeam = resource as unknown as RawTeam;
    return ((rawTeam.attributes.name as string | undefined) || "").trim().toLowerCase() === normalized;
  });

  return team?.id || null;
}

async function resolveNeededPositions(
  serviceTypeId: string,
  planId: string,
  seriesId: string | null
): Promise<NeededPositionsResolution> {
  if (seriesId) {
    return {
      response: await planningCenterCatalogService.getPlanNeededPositionsWithTeams(seriesId, planId),
      resolvedSeriesId: seriesId,
      neededPositionSource: "series-plan",
      usedSeriesFallback: false,
    };
  }

  try {
    return {
      response: await planningCenterCatalogService.getServiceTypePlanNeededPositionsWithTeams(
        serviceTypeId,
        planId
      ),
      resolvedSeriesId: null,
      neededPositionSource: "service-type-plan",
      usedSeriesFallback: false,
    };
  } catch (error) {
    log.warn(
      {
        serviceTypeId,
        planId,
        error: error instanceof Error ? error.message.slice(0, 280) : String(error).slice(0, 280),
      },
      "Service-type needed positions fetch failed, trying series lookup fallback"
    );

    const resolvedSeriesId = await getSeriesIdForPlan(serviceTypeId, planId);
    if (!resolvedSeriesId) {
      throw error;
    }

    return {
      response: await planningCenterCatalogService.getPlanNeededPositionsWithTeams(
        resolvedSeriesId,
        planId
      ),
      resolvedSeriesId,
      neededPositionSource: "series-plan",
      usedSeriesFallback: true,
    };
  }
}

async function getSeriesIdForPlan(
  serviceTypeId: string,
  planId: string
): Promise<string | null> {
  const scopedPlan = await planningCenterPlansService.getPlanForServiceTypeWithSeries(
    serviceTypeId,
    planId
  );
  const resolvedSeriesId =
    extractSeriesIdFromPlanResource(scopedPlan.data) ||
    extractSeriesIdFromIncluded(scopedPlan.included);

  if (resolvedSeriesId) {
    log.info({ planId, serviceTypeId, resolvedSeriesId }, "Resolved series ID for fallback");
  } else {
    log.warn(
      {
        planId,
        serviceTypeId,
        hasSeriesRelationshipData: hasSeriesRelationshipData(scopedPlan.data),
        seriesRelationshipLink: getSeriesRelationshipLink(scopedPlan.data),
        includedTypes: scopedPlan.included.map((r) => r.type),
      },
      "Unable to resolve series ID for needed positions fallback"
    );
  }

  return resolvedSeriesId;
}

function extractSeriesIdFromPlanResource(plan: PCResource): string | null {
  const rawPlan = plan as unknown as RawPlan;
  const seriesData = rawPlan.relationships?.series?.data;
  if (seriesData && !Array.isArray(seriesData)) {
    return seriesData.id || null;
  }

  const relatedLink = getSeriesRelationshipLink(plan);
  if (relatedLink) {
    const match = relatedLink.match(/\/series\/([^/?#]+)/);
    if (match?.[1]) return match[1];
  }

  return null;
}

function extractSeriesIdFromIncluded(included: PCResource[]): string | null {
  const series = included.find((r) => r.type === "Series");
  return series?.id || null;
}

function hasSeriesRelationshipData(plan: PCResource): boolean {
  const rawPlan = plan as unknown as RawPlan;
  const seriesData = rawPlan.relationships?.series?.data;
  return !!seriesData && !Array.isArray(seriesData);
}

function getSeriesRelationshipLink(plan: PCResource): string | null {
  const rel = plan.relationships?.series;
  if (!rel) return null;
  return rel.links?.related || null;
}
