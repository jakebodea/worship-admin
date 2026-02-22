import { planningCenterCatalogService } from "@/lib/planning-center/services/catalog-service";
import { planningCenterPlansService } from "@/lib/planning-center/services/plans-service";
import { logger } from "@/lib/logger";
import { findAllIncluded, findIncluded } from "@/lib/planning-center/utils";
import type {
  PCResource,
  RawPlan,
  RawNeededPosition,
  RawTeam,
  RawTeamPosition,
  TeamPosition,
  TeamPositionGroup,
} from "@/lib/types";

const log = logger.for("use-case/get-team-positions");

export async function getNeededTeamPositionsForPlan(
  serviceTypeId: string,
  planId: string,
  seriesId?: string | null
): Promise<TeamPositionGroup[]> {
  log.info(
    { serviceTypeId, planId, providedSeriesId: seriesId ?? null },
    "Fetching needed team positions for plan"
  );

  const resolvedSeriesId = seriesId || (await getSeriesIdForPlan(serviceTypeId, planId));
  const [teamPositionResponse, neededPositionResponse] = await Promise.all([
    planningCenterCatalogService.getServiceTypeTeamPositionsWithTeams(serviceTypeId),
    // Some plans are not attached to a Series (no `series` relationship in payload),
    // so `needed_positions` must be fetched from the service-type scoped plan path.
    resolvedSeriesId
      ? planningCenterCatalogService.getPlanNeededPositionsWithTeams(resolvedSeriesId, planId)
      : planningCenterCatalogService.getServiceTypePlanNeededPositionsWithTeams(
          serviceTypeId,
          planId
        ),
  ]);

  const teamPositions = Array.isArray(teamPositionResponse.data)
    ? teamPositionResponse.data
    : [teamPositionResponse.data];
  const teamPositionIncluded = teamPositionResponse.included || [];
  const neededPositions = Array.isArray(neededPositionResponse.data)
    ? neededPositionResponse.data
    : [neededPositionResponse.data];
  const neededIncluded = neededPositionResponse.included || [];
  const teamMap = new Map<string, TeamPositionGroup>();
  const positionsByTeamAndName = new Map<string, TeamPosition>();
  const seenPositionIdsByTeam = new Map<string, Set<string>>();

  for (const tp of teamPositions) {
    const position = tp as unknown as RawTeamPosition;
    const { teamId, teamName } = getTeamInfo(position, teamPositionIncluded);
    const positionName = (position.attributes.name as string | undefined)?.trim();
    if (!teamId || !teamName || !positionName) continue;

    positionsByTeamAndName.set(buildTeamPositionKey(teamId, positionName), {
      id: position.id,
      name: positionName,
      teamId,
      teamName,
    });
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
      seenPositionIdsByTeam.set(teamId, new Set<string>());
    }

    const seenIds = seenPositionIdsByTeam.get(teamId)!;
    if (seenIds.has(matchedPosition.id)) continue;
    seenIds.add(matchedPosition.id);

    teamMap.get(teamId)!.positions.push({
      ...matchedPosition,
      teamName,
    });
  }

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
      neededPositionSource: resolvedSeriesId ? "series-plan" : "service-type-plan",
      serviceTypeTeamPositionCount: teamPositions.length,
      neededPositionCount: neededPositions.length,
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

async function getSeriesIdForPlan(
  serviceTypeId: string,
  planId: string
): Promise<string | null> {
  const unscopedPlan = await planningCenterPlansService.getPlan(planId);
  const unscopedSeriesId = extractSeriesIdFromPlanResource(unscopedPlan as PCResource);
  if (unscopedSeriesId) {
    log.info({ planId, source: "unscoped-plan", seriesId: unscopedSeriesId }, "Resolved series ID");
    return unscopedSeriesId;
  }

  const scopedPlan = await planningCenterPlansService.getPlanForServiceTypeWithSeries(
    serviceTypeId,
    planId
  );
  const scopedSeriesId =
    extractSeriesIdFromPlanResource(scopedPlan.data) ||
    extractSeriesIdFromIncluded(scopedPlan.included);

  log.warn(
    {
      planId,
      serviceTypeId,
      unscopedHasSeriesRelationshipData: hasSeriesRelationshipData(unscopedPlan as PCResource),
      unscopedSeriesLink: getSeriesRelationshipLink(unscopedPlan as PCResource),
      scopedHasSeriesRelationshipData: hasSeriesRelationshipData(scopedPlan.data),
      scopedSeriesLink: getSeriesRelationshipLink(scopedPlan.data),
      scopedIncludedTypes: scopedPlan.included.map((r) => r.type),
      scopedResolvedSeriesId: scopedSeriesId,
    },
    "Series resolution fallback details"
  );

  return scopedSeriesId;
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
