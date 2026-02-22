import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getTeamPositionsForServiceType } from "@/lib/use-cases/planning-center/get-team-positions";

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

    const groupedPositions = await getTeamPositionsForServiceType(serviceTypeId);

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
