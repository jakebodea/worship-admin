import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getServiceTypes } from "@/lib/use-cases/planning-center/get-service-types";

export const dynamic = "force-dynamic";

const log = logger.for("api/service-types");

export async function GET() {
  log.info("Fetching service types");
  try {
    const serviceTypes = await getServiceTypes();

    log.info({ count: serviceTypes.length }, "Service types fetched");
    return NextResponse.json(serviceTypes);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    log.error({ err }, "Failed to fetch service types");
    return NextResponse.json(
      { error: "Failed to fetch service types", details: err.message },
      { status: 500 }
    );
  }
}
