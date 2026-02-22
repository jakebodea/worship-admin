import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getPlansForServiceType } from "@/lib/use-cases/planning-center/get-plans";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const log = logger.withRequest(request);
  log.info("Fetching plans");

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

    const plans = await getPlansForServiceType(serviceTypeId);

    log.info({ serviceTypeId, count: plans.length }, "Plans fetched");
    return NextResponse.json(plans);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    log.error({ err }, "Failed to fetch plans");
    return NextResponse.json(
      { error: "Failed to fetch plans", details: err.message },
      { status: 500 }
    );
  }
}
