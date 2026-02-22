import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { pcClient, findAllIncluded, findIncluded } from "@/lib/planning-center";
import type { TeamPositionGroup, RawTeamPosition, RawTeam } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const log = logger.withRequest(request);
  log.info("Fetching team positions");

  try {
    const { searchParams } = new URL(request.url);
    const serviceTypeId = searchParams.get("service_type_id");

    if (!serviceTypeId) {
      log.warn("Missing service_type_id parameter");
      return NextResponse.json(
        { error: "service_type_id query parameter is required" },
        { status: 400 }
      );
    }

    // Get team positions for this service type with team info included
    const response = await pcClient.getServiceTypeTeamPositionsWithTeams(serviceTypeId);

    const teamPositions = Array.isArray(response.data) ? response.data : [response.data];
    const included = response.included || [];

    // Group positions by team
    const teamMap = new Map<string, TeamPositionGroup>();

    for (const tp of teamPositions) {
      const position = tp as unknown as RawTeamPosition;
      
      // Get team from relationships or included
      let teamId = "";
      let teamName = "";

      if (position.relationships?.team?.data) {
        const teamData = position.relationships.team.data;
        teamId = Array.isArray(teamData) ? teamData[0]?.id || "" : teamData?.id || "";
      }

      if (teamId) {
        const team = findIncluded(included, "Team", teamId) as unknown as RawTeam | undefined;
        if (team) {
          teamName = team.attributes.name as string;
        }
      }

      if (!teamId || !teamName) {
        // Try to find team in included resources
        const teams = findAllIncluded(included, "Team");
        if (teams.length > 0) {
          const team = teams[0] as unknown as RawTeam;
          teamId = team.id;
          teamName = team.attributes.name as string;
        }
      }

      if (!teamId || !teamName) {
        continue; // Skip if we can't find team info
      }

      if (!teamMap.has(teamId)) {
        teamMap.set(teamId, {
          teamId,
          teamName,
          positions: [],
        });
      }

      const group = teamMap.get(teamId)!;
      group.positions.push({
        id: position.id,
        name: position.attributes.name as string,
        teamId,
        teamName,
      });
    }

    // Convert map to array and sort by team name
    const groupedPositions: TeamPositionGroup[] = Array.from(teamMap.values());
    groupedPositions.sort((a, b) => a.teamName.localeCompare(b.teamName));

    // Sort positions within each team
    groupedPositions.forEach((group) => {
      group.positions.sort((a, b) => a.name.localeCompare(b.name));
    });

    log.info(
      { serviceTypeId, teamCount: groupedPositions.length, positionCount: groupedPositions.reduce((sum, g) => sum + g.positions.length, 0) },
      "Team positions fetched"
    );
    return NextResponse.json(groupedPositions);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    log.error({ err }, "Failed to fetch team positions");
    return NextResponse.json(
      { error: "Failed to fetch team positions", details: err.message },
      { status: 500 }
    );
  }
}
