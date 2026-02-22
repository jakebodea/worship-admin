import { handleRoute } from "@/lib/http/route-handler";
import { logger } from "@/lib/logger";
import { getServiceTypes } from "@/lib/use-cases/planning-center/get-service-types";

export const dynamic = "force-dynamic";

const log = logger.for("api/service-types");

export async function GET() {
  return handleRoute(async () => {
    log.info("Fetching service types");
    const serviceTypes = await getServiceTypes();

    log.info({ count: serviceTypes.length }, "Service types fetched");
    return serviceTypes;
  });
}
