import { handleRoute } from "@/lib/http/route-handler";
import { getTeamPositionsForServiceType } from "@/lib/use-cases/planning-center/get-team-positions";
import { serviceTypeQuerySchema } from "@/lib/use-cases/planning-center/schemas";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleRoute(async () => {
    const parsed = serviceTypeQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams.entries())
    );
    return getTeamPositionsForServiceType(parsed.service_type_id);
  });
}
