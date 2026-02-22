import { handleRoute } from "@/lib/http/route-handler";
import { getPeopleForPosition } from "@/lib/use-cases/planning-center/get-people-for-position";
import { peopleQuerySchema } from "@/lib/use-cases/planning-center/schemas";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleRoute(async () => {
    const parsed = peopleQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams.entries())
    );
    return getPeopleForPosition({
      serviceTypeId: parsed.service_type_id,
      positionId: parsed.position_id,
      date: parsed.date,
    });
  });
}
