import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getTeams } from "@/lib/use-cases/planning-center/get-teams";

export const dynamic = "force-dynamic";

const log = logger.for("api/teams");

export async function GET() {
  log.info("Fetching teams");
  try {
    const teams = await getTeams();

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
