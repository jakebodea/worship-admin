import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { pcClient, findIncluded } from "@/lib/planning-center";
import { isServiceExcluded } from "@/lib/excluded-services";
import type { PlanPerson, RawPlanPerson, RawPlan, ScheduleFrequency } from "@/lib/types";

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
    const now = new Date();
    const lookbackStart = new Date(now);
    lookbackStart.setDate(lookbackStart.getDate() - lookbackDays);

    const historyResponse = await pcClient.getPersonPlanPeopleWithPlans(
      id,
      {},
      3
    );

    const rawPlanPeople = historyResponse.data as unknown as RawPlanPerson[];
    const historyIncluded = historyResponse.included || [];

    // Exclude records that belong to excluded service types.
    const serviceFiltered = rawPlanPeople.filter((pp) => {
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

    // Keep only confirmed responses in-app instead of using undocumented filter params.
    const confirmed = serviceFiltered.filter((pp) => {
      const status = (pp.attributes.status || "").toString().toLowerCase();
      return status === "confirmed" || status === "c";
    });

    const planPeople: PlanPerson[] = confirmed
      .map((raw) => {
      const pp = raw as unknown as RawPlanPerson;
      const planRel = pp.relationships?.plan?.data;
      const planId = Array.isArray(planRel) ? planRel[0]?.id : planRel?.id;
      const plan = planId
        ? (findIncluded(historyIncluded, "Plan", planId) as unknown as
            | RawPlan
            | undefined)
        : undefined;

      const serviceDate = plan?.attributes.sort_date
        ? new Date(plan.attributes.sort_date)
        : new Date(pp.attributes.created_at);

      return {
        id: pp.id,
        status: pp.attributes.status,
        createdAt: serviceDate,
        teamPositionName: pp.attributes.team_position_name || "",
        planTitle: (plan?.attributes.title as string | undefined) || undefined,
        planDate: serviceDate,
        declineReason: pp.attributes.decline_reason,
      };
      })
      .filter((pp) => pp.createdAt >= lookbackStart);

    // Sort newest first for display.
    planPeople.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Calculate frequency metrics
    const frequency: ScheduleFrequency = {
      last30Days: 0,
      last60Days: 0,
      last90Days: 0,
      totalServed: 0,
      upcomingServices: 0,
    };

    const pastServiceDates = new Set<string>();
    const futureServiceDates = new Set<string>();

    planPeople.forEach((pp) => {
      const normalized = new Date(pp.createdAt);
      normalized.setHours(0, 0, 0, 0);
      const dayKey = normalized.toISOString().split("T")[0];
      const daysAgo = Math.floor((now.getTime() - normalized.getTime()) / (1000 * 60 * 60 * 24));

      if (daysAgo >= 0) {
        if (!pastServiceDates.has(dayKey)) {
          pastServiceDates.add(dayKey);
          if (daysAgo <= 30) frequency.last30Days++;
          if (daysAgo <= 60) frequency.last60Days++;
          if (daysAgo <= 90) frequency.last90Days++;
        }
      } else if (!futureServiceDates.has(dayKey)) {
        futureServiceDates.add(dayKey);
        frequency.upcomingServices++;
      }
    });

    frequency.totalServed = pastServiceDates.size;

    const mostRecentPast = planPeople.find((pp) => pp.createdAt <= now);
    if (mostRecentPast) {
      frequency.lastServedDate = mostRecentPast.createdAt;
    }

    log.info(
      { personId: id, planPeopleCount: Math.min(planPeople.length, 20), totalServed: frequency.totalServed },
      "Schedule history fetched"
    );
    return NextResponse.json({
      planPeople: planPeople.slice(0, 20), // Return last 20 for display
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
