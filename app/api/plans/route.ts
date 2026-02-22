import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { pcClient } from "@/lib/planning-center";
import type { Plan, RawPlan } from "@/lib/types";

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

    // Limit to a reasonable date range to avoid fetching too many pages
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysBack = 90; // Look back 90 days
    const daysForward = 90; // Look forward 90 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysBack);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + daysForward);

    const rawPlans = await pcClient.getPlansNearDate(serviceTypeId, today, 5, 5, 3);

    const plans: Plan[] = rawPlans
      .map((raw) => {
        const plan = raw as unknown as RawPlan;
        const sortDateStr = plan.attributes.sort_date as string | undefined;
        
        // Only include plans that have a sort_date (existing plans)
        if (!sortDateStr) return null;
        
        const sortDate = new Date(sortDateStr);
        
        // Validate date is valid
        if (isNaN(sortDate.getTime())) {
          return null;
        }

        const planObj: Plan = {
          id: plan.id,
          title: plan.attributes.title as string,
          seriesTitle: plan.attributes.series_title as string | undefined,
          createdAt: new Date(plan.attributes.created_at as string),
          sortDate,
        };
        return planObj;
      })
      .filter((plan): plan is Plan => plan !== null);

    // Sort by date ascending
    plans.sort((a, b) => {
      if (!a.sortDate || !b.sortDate) return 0;
      return a.sortDate.getTime() - b.sortDate.getTime();
    });

    // Keep only plans near today without relying on undocumented query params
    const boundedPlans = plans.filter((p) => {
      if (!p.sortDate) return false;
      return p.sortDate >= startDate && p.sortDate <= endDate;
    });

    // Split into past and future plans relative to today
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const pastPlans = boundedPlans.filter((p) => p.sortDate && p.sortDate < todayStart);
    const futurePlans = boundedPlans.filter((p) => p.sortDate && p.sortDate > todayEnd);
    const todayPlans = boundedPlans.filter(
      (p) => p.sortDate && p.sortDate >= todayStart && p.sortDate <= todayEnd
    );

    // Take 5 from past (most recent first) and 5 from future (earliest first)
    const recentPast = pastPlans.slice(-5).reverse(); // Most recent 5 past plans
    const upcomingFuture = futurePlans.slice(0, 5); // Next 5 future plans

    // Combine: past plans + today's plans + future plans
    const limitedPlans = [...recentPast, ...todayPlans, ...upcomingFuture];

    // Sort final result by date
    limitedPlans.sort((a, b) => {
      if (!a.sortDate || !b.sortDate) return 0;
      return a.sortDate.getTime() - b.sortDate.getTime();
    });

    log.info({ serviceTypeId, count: limitedPlans.length }, "Plans fetched");
    return NextResponse.json(limitedPlans);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    log.error({ err }, "Failed to fetch plans");
    return NextResponse.json(
      { error: "Failed to fetch plans", details: err.message },
      { status: 500 }
    );
  }
}
