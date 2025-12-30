import { NextResponse } from "next/server";
import { pcClient, findIncluded } from "@/lib/planning-center";
import { isServiceExcluded } from "@/lib/excluded-services";
import type { PlanPerson, RawPlanPerson, RawPlan, ScheduleFrequency } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch plan_people for this person with plan and service_type included
    const historyResponse = await pcClient.getPersonPlanPeopleWithPlans(id, {
      filter: "confirmed",
      order: "-created_at",
    });

    const rawPlanPeople = historyResponse.data as unknown as RawPlanPerson[];
    const historyIncluded = historyResponse.included || [];

    // Filter out plan_people that belong to excluded service types
    const filteredPlanPeople = rawPlanPeople.filter((pp) => {
      const planId = pp.relationships?.plan?.data;
      if (planId) {
        const planIdStr = Array.isArray(planId)
          ? planId[0]?.id
          : planId?.id;
        if (planIdStr) {
          const plan = findIncluded(
            historyIncluded,
            "Plan",
            planIdStr
          ) as unknown as RawPlan | undefined;

          if (plan?.relationships?.service_type?.data) {
            const stData = plan.relationships.service_type.data;
            const stId = Array.isArray(stData)
              ? stData[0]?.id
              : stData?.id;
            if (stId && isServiceExcluded(stId)) {
              return false; // Exclude this plan_person
            }
          }
        }
      }
      return true; // Include if we can't determine service type or it's not excluded
    });

    const planPeople: PlanPerson[] = filteredPlanPeople.map((raw) => {
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
      upcomingServices: 0, // This endpoint only returns historical data
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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch schedule history" },
      { status: 500 }
    );
  }
}
