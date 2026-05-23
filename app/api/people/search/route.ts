import { z } from "zod";
import { handlePlanningCenterRoute } from "@/lib/http/planning-center-route";
import { logger } from "@/lib/logger";
import { planningCenterPeopleService } from "@/lib/planning-center/services/people-service";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  q: z.string().trim().min(2).max(80),
});

export interface PeopleSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  photoThumbnailUrl: string | null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function GET(request: Request) {
  const log = logger.withRequest(request);

  return handlePlanningCenterRoute(request, async () => {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      q: searchParams.get("q") ?? "",
    });

    if (!parsed.success) {
      log.warn({ issues: parsed.error.issues }, "Invalid people search query");
      throw parsed.error;
    }

    const people = await planningCenterPeopleService.searchPeopleByName(parsed.data.q, 15);
    const results = people.map((person): PeopleSearchResult => {
      const firstName = readString(person.attributes.first_name);
      const lastName = readString(person.attributes.last_name);
      return {
        id: person.id,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`.trim() || "Unknown person",
        photoThumbnailUrl: typeof person.attributes.avatar === "string"
          ? person.attributes.avatar
          : typeof person.attributes.photo_thumbnail_url === "string"
            ? person.attributes.photo_thumbnail_url
            : null,
      };
    });

    log.info({ queryLength: parsed.data.q.length, count: results.length }, "People search completed");

    return results;
  });
}
