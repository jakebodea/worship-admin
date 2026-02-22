import { z } from "zod";
import { ApiError } from "@/lib/http/api-error";
import { handleRoute } from "@/lib/http/route-handler";
import { logger } from "@/lib/logger";
import { getFutureBlockoutsForPerson } from "@/lib/use-cases/planning-center/get-person-blockouts";

export const dynamic = "force-dynamic";

const paramsSchema = z.object({
  id: z.string().min(1),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const log = logger.withRequest(request);
  return handleRoute(async () => {
    const parsedParams = paramsSchema.safeParse(await params);
    if (!parsedParams.success) {
      log.warn({ issues: parsedParams.error.issues }, "Invalid blockouts route params");
      throw new ApiError(400, "INVALID_REQUEST", "Invalid request", parsedParams.error.issues);
    }
    const { id } = parsedParams.data;
    log.info({ personId: id }, "Fetching blockouts");
    const blockouts = await getFutureBlockoutsForPerson(id);

    log.info({ personId: id, count: blockouts.length }, "Blockouts fetched");
    return blockouts;
  });
}
