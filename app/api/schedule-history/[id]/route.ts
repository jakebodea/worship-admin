import { NextResponse } from "next/server";
import { pcClient } from "@/lib/planning-center";
import type { PlanPerson, RawPlanPerson, ScheduleFrequency } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch plan_people for this person
    const rawPlanPeople = await pcClient.getPersonPlanPeople(id, {
      filter: "confirmed",
      order: "-created_at",
    });

    const planPeople: PlanPerson[] = rawPlanPeople.map((raw) => {
      const pp = raw as unknown as RawPlanPerson;
      return {
        id: pp.id,
        status: pp.attributes.status,
        createdAt: new Date(pp.attributes.created_at),
        teamPositionName: pp.attributes.team_position_name || "",
        declineReason: pp.attributes.decline_reason,
      };
    });

    // Calculate frequency metrics
    const now = new Date();
    const frequency: ScheduleFrequency = {
      last30Days: 0,
      last60Days: 0,
      last90Days: 0,
      totalServed: planPeople.length,
    };

    planPeople.forEach((pp) => {
      const daysAgo = Math.floor(
        (now.getTime() - pp.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysAgo <= 30) frequency.last30Days++;
      if (daysAgo <= 60) frequency.last60Days++;
      if (daysAgo <= 90) frequency.last90Days++;
    });

    // Get the most recent service date
    if (planPeople.length > 0) {
      frequency.lastServedDate = planPeople[0].createdAt;
    }

    return NextResponse.json({
      planPeople: planPeople.slice(0, 20), // Return last 20 for display
      frequency,
    });
  } catch (error) {
    console.error("Error fetching schedule history:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule history" },
      { status: 500 }
    );
  }
}
