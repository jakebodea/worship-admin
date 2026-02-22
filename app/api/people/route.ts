import { z } from "zod";
import { handleRoute } from "@/lib/http/route-handler";
import { logger } from "@/lib/logger";
import { getPeopleForPosition } from "@/lib/use-cases/planning-center/get-people-for-position";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  position_id: z.string().min(1).optional(),
  service_type_id: z.string().min(1).optional(),
  team_id: z.string().min(1).optional(),
  plan_id: z.string().min(1).optional(),
  date: z.string().optional(),
});

export async function GET(request: Request) {
  const log = logger.withRequest(request);

  return handleRoute(async () => {
    log.info("Request started");

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      position_id: searchParams.get("position_id") ?? undefined,
      service_type_id: searchParams.get("service_type_id") ?? undefined,
      team_id: searchParams.get("team_id") ?? undefined,
      plan_id: searchParams.get("plan_id") ?? undefined,
      date: searchParams.get("date") ?? undefined,
    });

    if (!parsed.success) {
      log.warn({ issues: parsed.error.issues }, "Invalid people query params");
      throw parsed.error;
    }

    const positionId = parsed.data.position_id ?? null;
    const serviceTypeId = parsed.data.service_type_id ?? null;
    const teamId = parsed.data.team_id ?? null;
    const planId = parsed.data.plan_id ?? null;
    const date = parsed.data.date;

    if (!positionId || !serviceTypeId) {
      log.info("Missing position_id or service_type_id, returning empty");
      return [];
    }

    const people = await getPeopleForPosition({
      serviceTypeId,
      positionId,
      teamId: teamId ?? undefined,
      planId: planId ?? undefined,
      date,
    });

    log.info(
      {
        positionId,
        serviceTypeId,
        date: date ?? null,
        count: people.length,
      },
      "People fetched"
    );

    return people;
  });
}
