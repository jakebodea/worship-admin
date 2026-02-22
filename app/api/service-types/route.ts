import { handleRoute } from "@/lib/http/route-handler";
import { getServiceTypes } from "@/lib/use-cases/planning-center/get-service-types";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(getServiceTypes);
}
