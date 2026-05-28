import { z } from "zod";
import { ApiError } from "@/lib/http/api-error";
import { handlePlanningCenterRoute } from "@/lib/http/planning-center-route";
import { logger } from "@/lib/logger";
import { serializePlanTimes } from "@/lib/plan-time-client";
import { planTimesQuerySchema } from "@/lib/use-cases/planning-center/schemas";
import { getPlanTimes } from "@/lib/use-cases/planning-center/plan-times";

export const dynamic = "force-dynamic";

const paramsSchema = z.object({
  planId: z.string().min(1),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ planId: string }> }
) {
  const log = logger.withRequest(request);
  return handlePlanningCenterRoute(request, async () => {
    const parsedParams = paramsSchema.safeParse(await params);
    if (!parsedParams.success) {
      log.warn({ issues: parsedParams.error.issues }, "Invalid plan-times route params");
      throw new ApiError(400, "INVALID_REQUEST", "Invalid request", parsedParams.error.issues);
    }

    const { searchParams } = new URL(request.url);
    const parsedQuery = planTimesQuerySchema.safeParse({
      service_type_id: searchParams.get("service_type_id") ?? undefined,
    });
    if (!parsedQuery.success) {
      log.warn({ issues: parsedQuery.error.issues }, "Invalid plan-times query params");
      throw new ApiError(400, "INVALID_REQUEST", "Invalid request", parsedQuery.error.issues);
    }

    const planTimes = await getPlanTimes(parsedParams.data.planId);
    return serializePlanTimes(planTimes);
  });
}
