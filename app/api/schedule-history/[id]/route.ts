import { handleRoute } from "@/lib/http/route-handler";
import { getScheduleHistory } from "@/lib/use-cases/planning-center/get-schedule-history";
import {
  personIdParamsSchema,
  scheduleHistoryQuerySchema,
} from "@/lib/use-cases/planning-center/schemas";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleRoute(async () => {
    const parsedParams = personIdParamsSchema.parse(await params);
    const parsedQuery = scheduleHistoryQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams.entries())
    );
    return getScheduleHistory(parsedParams.id, parsedQuery.days);
  });
}
