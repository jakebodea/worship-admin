import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getFutureBlockoutsForPerson } from "@/lib/use-cases/planning-center/get-person-blockouts";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const log = logger.withRequest(request);
  const { id } = await params;
  log.info({ personId: id }, "Fetching blockouts");

  try {
    const blockouts = await getFutureBlockoutsForPerson(id);

    log.info({ personId: id, count: blockouts.length }, "Blockouts fetched");
    return NextResponse.json(blockouts);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    log.error({ err, personId: id }, "Failed to fetch blockouts");
    return NextResponse.json(
      { error: "Failed to fetch blockouts", details: err.message },
      { status: 500 }
    );
  }
}
