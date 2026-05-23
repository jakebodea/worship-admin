import { peoplePageFlag } from "@/flags";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    enabled: await peoplePageFlag(),
  });
}
