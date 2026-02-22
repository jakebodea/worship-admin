import { handleRoute } from "@/lib/http/route-handler";
import { getTeams } from "@/lib/use-cases/planning-center/get-teams";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(getTeams);
}
