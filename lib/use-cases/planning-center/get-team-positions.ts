import { planningCenterCatalogService } from "@/lib/planning-center/services/catalog-service";
import { findAllIncluded, findIncluded } from "@/lib/planning-center/utils";
import type { RawTeam, RawTeamPosition, TeamPositionGroup } from "@/lib/types";

export async function getTeamPositionsForServiceType(
  serviceTypeId: string
): Promise<TeamPositionGroup[]> {
  const response =
    await planningCenterCatalogService.getServiceTypeTeamPositionsWithTeams(
      serviceTypeId
    );

  const teamPositions = Array.isArray(response.data) ? response.data : [response.data];
  const included = response.included || [];
  const teamMap = new Map<string, TeamPositionGroup>();

  for (const tp of teamPositions) {
    const position = tp as unknown as RawTeamPosition;
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

    if (!teamId || !teamName) continue;

    if (!teamMap.has(teamId)) {
      teamMap.set(teamId, { teamId, teamName, positions: [] });
    }

    const group = teamMap.get(teamId)!;
    group.positions.push({
      id: position.id,
      name: position.attributes.name as string,
      teamId,
      teamName,
    });
  }

  const groupedPositions: TeamPositionGroup[] = Array.from(teamMap.values());
  groupedPositions.sort((a, b) => a.teamName.localeCompare(b.teamName));
  groupedPositions.forEach((group) => {
    group.positions.sort((a, b) => a.name.localeCompare(b.name));
  });
  return groupedPositions;
}
