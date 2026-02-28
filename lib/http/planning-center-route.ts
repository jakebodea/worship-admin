import {
  withPlanningCenterUser,
  type PlanningCenterUserAuthContext,
} from "@/lib/auth/planning-center-session";
import { handleRoute } from "@/lib/http/route-handler";

export function handlePlanningCenterRoute<T>(
  request: Request,
  handler: (ctx: PlanningCenterUserAuthContext) => Promise<T>
) {
  return handleRoute(async () => withPlanningCenterUser(request, handler));
}
