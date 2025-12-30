import { NextResponse } from "next/server";
import { pcClient } from "@/lib/planning-center";
import { isServiceExcluded } from "@/lib/excluded-services";
import type { ServiceType, RawServiceType } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rawServiceTypes = await pcClient.getServiceTypes({
      "filter[archived]": "false",
    });

    const serviceTypes: ServiceType[] = rawServiceTypes
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

    return NextResponse.json(serviceTypes);
  } catch (error) {
    console.error("Error fetching service types:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch service types", details: errorMessage },
      { status: 500 }
    );
  }
}
