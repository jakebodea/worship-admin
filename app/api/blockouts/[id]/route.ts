import { handleRoute } from "@/lib/http/route-handler";
import { getFutureBlockoutsForPerson } from "@/lib/use-cases/planning-center/get-person-blockouts";
import { personIdParamsSchema } from "@/lib/use-cases/planning-center/schemas";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleRoute(async () => {
    const parsed = personIdParamsSchema.parse(await params);
    return getFutureBlockoutsForPerson(parsed.id);
  });
}
