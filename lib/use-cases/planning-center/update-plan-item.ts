import { planningCenterPlanItemsService } from "@/lib/planning-center/services/plan-items-service";
import type { PlanItem, PlanItemServicePosition } from "@/lib/types";
import { getSongOptions } from "@/lib/use-cases/planning-center/get-song-options";
import { normalizePlanItem } from "@/lib/use-cases/planning-center/plan-items-shared";

export interface UpdatePlanItemInput {
  serviceTypeId: string;
  planId: string;
  itemId: string;
  title?: string;
  servicePosition?: PlanItemServicePosition;
  length?: number | null;
  description?: string;
  htmlDetails?: string;
  songId?: string;
  arrangementId?: string;
  keyId?: string;
  selectedLayoutId?: string;
  customArrangementSequence?: string[];
}

function omitUndefined(record: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined));
}

export async function updatePlanItem(input: UpdatePlanItemInput): Promise<PlanItem> {
  let title = input.title?.trim();
  let arrangementId = input.arrangementId;
  let keyId = input.keyId;
  let selectedLayoutId = input.selectedLayoutId;

  if (input.songId && (!arrangementId || !keyId || !title)) {
    const options = await getSongOptions(input.songId, input.serviceTypeId);
    title ||= options.song.title;
    arrangementId ||= options.suggestedArrangementId ?? undefined;
    keyId ||= options.suggestedKeyId ?? undefined;
    selectedLayoutId ||= options.suggestedLayoutId ?? undefined;
  }

  const response = await planningCenterPlanItemsService.updatePlanItem(
    input.serviceTypeId,
    input.planId,
    input.itemId,
    omitUndefined({
      title: title || undefined,
      service_position: input.servicePosition,
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
    })
  );

  return normalizePlanItem(response.data, response.included);
}
