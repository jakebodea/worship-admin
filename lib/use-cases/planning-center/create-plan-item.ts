import { planningCenterPlanItemsService } from "@/lib/planning-center/services/plan-items-service";
import type { PlanItem, PlanItemServicePosition, PlanItemType } from "@/lib/types";
import { getSongOptions } from "@/lib/use-cases/planning-center/get-song-options";
import { normalizePlanItem } from "@/lib/use-cases/planning-center/plan-items-shared";

export interface CreatePlanItemInput {
  serviceTypeId: string;
  planId: string;
  title?: string;
  itemType?: PlanItemType;
  servicePosition?: PlanItemServicePosition;
  length?: number | null;
  description?: string;
  htmlDetails?: string;
  songId?: string;
  arrangementId?: string | null;
  keyId?: string | null;
  selectedLayoutId?: string | null;
  customArrangementSequence?: string[];
}

function omitUndefined(record: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined));
}

export async function createPlanItem(input: CreatePlanItemInput): Promise<PlanItem> {
  let title = input.title?.trim();
  let arrangementId = input.arrangementId ?? undefined;
  let keyId = input.keyId ?? undefined;
  let selectedLayoutId = input.selectedLayoutId ?? undefined;

  if (input.songId && (!arrangementId || !keyId || !title)) {
    const options = await getSongOptions(input.songId, input.serviceTypeId);
    title ||= options.song.title;
    arrangementId ||= options.suggestedArrangementId ?? undefined;
    keyId ||= options.suggestedKeyId ?? undefined;
    selectedLayoutId ||= options.suggestedLayoutId ?? undefined;
  }

  const attributes = omitUndefined({
    title: title || undefined,
    item_type: input.itemType === "header" ? "header" : undefined,
    service_position: input.servicePosition ?? "during",
    length: input.length === undefined ? undefined : input.length,
    description: input.description?.trim() || undefined,
    html_details: input.htmlDetails?.trim() || undefined,
    song_id: input.songId,
    arrangement_id: arrangementId,
    key_id: keyId,
    selected_layout_id: selectedLayoutId,
    custom_arrangement_sequence:
      input.customArrangementSequence && input.customArrangementSequence.length > 0
        ? input.customArrangementSequence
        : undefined,
  });

  const response = await planningCenterPlanItemsService.createPlanItem(
    input.serviceTypeId,
    input.planId,
    attributes
  );

  return normalizePlanItem(response.data, response.included);
}
