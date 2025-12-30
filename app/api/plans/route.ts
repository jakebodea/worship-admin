import { NextResponse } from "next/server";
import { pcClient } from "@/lib/planning-center";
import type { Plan, RawPlan } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const serviceTypeId = searchParams.get("service_type_id");

    console.log(`[API /plans] Starting request for service_type_id: ${serviceTypeId}`);

    if (!serviceTypeId) {
      return NextResponse.json(
        { error: "service_type_id query parameter is required" },
        { status: 400 }
      );
    }

    console.log(`[API /plans] Calling pcClient.getPlans...`);
    // Limit to a reasonable date range to avoid fetching too many pages
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysBack = 90; // Look back 90 days
    const daysForward = 90; // Look forward 90 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysBack);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + daysForward);

    const rawPlans = await pcClient.getPlans(serviceTypeId, {
      "filter[archived]": "false",
      "filter[sort_date]": `${startDate.toISOString().split("T")[0]}..${endDate.toISOString().split("T")[0]}`,
    });
    console.log(`[API /plans] Received ${rawPlans.length} raw plans from API`);

    const plans: Plan[] = rawPlans
      .map((raw) => {
        const plan = raw as unknown as RawPlan;
        const sortDateStr = plan.attributes.sort_date as string | undefined;
        
        // Only include plans that have a sort_date (existing plans)
        if (!sortDateStr) return null;
        
        const sortDate = new Date(sortDateStr);
        
        // Validate date is valid
        if (isNaN(sortDate.getTime())) {
          console.warn(`[API /plans] Invalid sort_date for plan ${plan.id}: ${sortDateStr}`);
          return null;
        }

        return {
          id: plan.id,
          title: plan.attributes.title as string,
          seriesTitle: plan.attributes.series_title as string | undefined,
          createdAt: new Date(plan.attributes.created_at as string),
          sortDate,
        };
      })
      .filter((plan): plan is Plan => plan !== null);

    // Sort by date ascending
    plans.sort((a, b) => {
      if (!a.sortDate || !b.sortDate) return 0;
      return a.sortDate.getTime() - b.sortDate.getTime();
    });

    // Split into past and future plans relative to today
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const pastPlans = plans.filter((p) => p.sortDate && p.sortDate < todayStart);
    const futurePlans = plans.filter((p) => p.sortDate && p.sortDate > todayEnd);
    const todayPlans = plans.filter(
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

    const duration = Date.now() - startTime;
    console.log(`[API /plans] Returning ${limitedPlans.length} plans (${recentPast.length} past, ${todayPlans.length} today, ${upcomingFuture.length} future) (took ${duration}ms)`);
    return NextResponse.json(limitedPlans);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API /plans] Error after ${duration}ms:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch plans", details: errorMessage },
      { status: 500 }
    );
  }
}
