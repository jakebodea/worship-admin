import { handlePlanningCenterRoute } from "@/lib/http/planning-center-route";
import { resolveOrganizationTimeZone } from "@/lib/planning-center/resolve-organization-timezone";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handlePlanningCenterRoute(request, async () => {
    const timeZone = await resolveOrganizationTimeZone();
    return { timeZone };
  });
}
