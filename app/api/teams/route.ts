import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { pcClient } from "@/lib/planning-center";
import type { Team, RawTeam } from "@/lib/types";

export const dynamic = "force-dynamic";

const log = logger.for("api/teams");

export async function GET() {
  log.info("Fetching teams");
  try {
    const rawTeams = await pcClient.getTeams();

    const teams: Team[] = rawTeams
      .filter((rawTeam) => !(rawTeam.attributes.archived_at as string | null))
      .map((rawTeam) => {
      const team = rawTeam as unknown as RawTeam;
      return {
        id: team.id,
        name: team.attributes.name,
        sequence: team.attributes.sequence,
        rehearsalTeam: team.attributes.rehearsal_team,
      };
    });

    // Sort by sequence
    teams.sort((a, b) => a.sequence - b.sequence);

    log.info({ count: teams.length }, "Teams fetched");
    return NextResponse.json(teams);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    log.error({ err }, "Failed to fetch teams");
    return NextResponse.json(
      { error: "Failed to fetch teams", details: err.message },
      { status: 500 }
    );
  }
}
