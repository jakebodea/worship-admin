import { NextResponse } from "next/server";
import { pcClient } from "@/lib/planning-center";
import type { Blockout, RawBlockout } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch future blockouts for this person
    const rawBlockouts = await pcClient.getPersonBlockouts(id, {
      filter: "future",
    });

    const blockouts: Blockout[] = rawBlockouts.map((rawBlockout) => {
      const blockout = rawBlockout as unknown as RawBlockout;
      return {
        id: blockout.id,
        reason: blockout.attributes.reason || "",
        startsAt: new Date(blockout.attributes.starts_at),
        endsAt: new Date(blockout.attributes.ends_at),
        description: blockout.attributes.description || "",
        share: blockout.attributes.share,
      };
    });

    return NextResponse.json(blockouts);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch blockouts" },
      { status: 500 }
    );
  }
}
