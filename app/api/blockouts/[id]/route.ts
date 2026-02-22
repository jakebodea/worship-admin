import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { pcClient } from "@/lib/planning-center";
import type { Blockout, RawBlockout } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const log = logger.withRequest(request);
  const { id } = await params;
  log.info({ personId: id }, "Fetching blockouts");

  try {
    const rawBlockouts = await pcClient.getPersonBlockouts(id);

    const now = new Date();
    const blockouts: Blockout[] = rawBlockouts
      .map((rawBlockout) => {
        const blockout = rawBlockout as unknown as RawBlockout;
        return {
          id: blockout.id,
          reason: blockout.attributes.reason || "",
          startsAt: new Date(blockout.attributes.starts_at),
          endsAt: new Date(blockout.attributes.ends_at),
          description: blockout.attributes.description || "",
          share: blockout.attributes.share,
        };
      })
      .filter((blockout) => blockout.endsAt >= now);

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
