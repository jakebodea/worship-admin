import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { pcClient } from "@/lib/planning-center";
import { isServiceExcluded } from "@/lib/excluded-services";
import type { ServiceType, RawServiceType } from "@/lib/types";

export const dynamic = "force-dynamic";

const log = logger.for("api/service-types");

export async function GET() {
  log.info("Fetching service types");
  try {
    const rawServiceTypes = await pcClient.getServiceTypes();

    const activeRawServiceTypes = rawServiceTypes.filter((raw) => {
      const archivedAt = (raw.attributes.archived_at as string | null) || null;
      return !archivedAt;
    });

    const serviceTypes: ServiceType[] = activeRawServiceTypes
      .map((raw) => {
        const st = raw as unknown as RawServiceType;
        return {
          id: st.id,
          name: st.attributes.name as string,
          sequence: st.attributes.sequence as number,
        };
      })
      .filter((st) => !isServiceExcluded(st.id));

    // Sort by sequence
    serviceTypes.sort((a, b) => a.sequence - b.sequence);

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
