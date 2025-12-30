import { NextResponse } from "next/server";
import { pcClient } from "@/lib/planning-center";
import type { Team, RawTeam } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rawTeams = await pcClient.getTeams({
      "filter[archived]": "false",
    });

    const teams: Team[] = rawTeams.map((rawTeam) => {
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

    return NextResponse.json(teams);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch teams", details: errorMessage },
      { status: 500 }
    );
  }
}
