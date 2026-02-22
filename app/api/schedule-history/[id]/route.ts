import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getScheduleHistory } from "@/lib/use-cases/planning-center/get-schedule-history";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const log = logger.withRequest(request);
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") || "90");
  const lookbackDays = Number.isFinite(days) && days > 0 ? days : 90;
  log.info({ personId: id, lookbackDays }, "Fetching schedule history");

  try {
    const { planPeople, frequency } = await getScheduleHistory(id, lookbackDays);

    log.info(
      { personId: id, planPeopleCount: planPeople.length, totalServed: frequency.totalServed },
      "Schedule history fetched"
    );
    return NextResponse.json({
      planPeople,
      frequency,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    log.error({ err, personId: id }, "Failed to fetch schedule history");
    return NextResponse.json(
      { error: "Failed to fetch schedule history", details: err.message },
      { status: 500 }
    );
  }
}
