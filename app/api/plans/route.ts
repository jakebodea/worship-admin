import { handleRoute } from "@/lib/http/route-handler";
import { getPlansForServiceType } from "@/lib/use-cases/planning-center/get-plans";
import { plansQuerySchema } from "@/lib/use-cases/planning-center/schemas";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleRoute(async () => {
    const parsed = plansQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams.entries())
    );
    return getPlansForServiceType(parsed.service_type_id);
  });
}
