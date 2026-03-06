"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJson, patchJson, postJson } from "@/lib/http/client";
import { hydratePlanItem, type SerializedPlanItem } from "@/lib/plan-item-client";
import {
  appendPlanItem,
  applyPlanItemsOptimisticUpdate,
  removePlanItem,
  replacePlanItem,
  restorePlanItemsSnapshot,
  type PlanItemsOptimisticSnapshot,
} from "@/lib/plan-items-query-state";
import { queryKeys } from "@/lib/query-keys";
import type { PlanItem, SongCatalogEntry } from "@/lib/types";
import { usePlanItems } from "@/hooks/use-plan-items";
import { getItemTypeLabel, type DraftState } from "@/components/schedule/plan-tab-helpers";
import { toast } from "@/components/ui/sonner";

interface UsePlanTabControllerArgs {
  serviceTypeId: string | null;
  planId: string | null;
}

const EMPTY_PLAN_ITEMS: PlanItem[] = [];

function buildDeletePlanItemUrl(
  itemId: string,
  serviceTypeId: string,
  planId: string
): string {
  const params = new URLSearchParams({
    service_type_id: serviceTypeId,
    plan_id: planId,
  });

  return `/api/plan-items/${itemId}?${params.toString()}`;
}

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function usePlanTabController({
  serviceTypeId,
  planId,
}: UsePlanTabControllerArgs) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.planItems(serviceTypeId, planId);
  const { data: itemsData, isLoading } = usePlanItems(serviceTypeId, planId);
  const items = itemsData ?? EMPTY_PLAN_ITEMS;

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [songPickerOpen, setSongPickerOpen] = useState(false);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const [pendingSongId, setPendingSongId] = useState<string | null>(null);

  const invalidatePlanItems = () =>
    queryClient.invalidateQueries({
      queryKey,
    });

  const createItemMutation = useMutation({
    mutationFn: async (kind: "header" | "item") => {
      if (!serviceTypeId || !planId) {
        throw new Error("A service type and plan must be selected.");
      }

      const item = await postJson<SerializedPlanItem>("/api/plan-items", {
        service_type_id: serviceTypeId,
        plan_id: planId,
        item_type: kind,
        title: kind === "header" ? "New Header" : "New Item",
      });

      return hydratePlanItem(item);
    },
    onMutate: (kind) => {
      setPendingItemId(`create-${kind}`);
    },
    onSuccess: (item) => {
      queryClient.setQueryData<PlanItem[]>(queryKey, (current = EMPTY_PLAN_ITEMS) =>
        appendPlanItem(current, item)
      );
      setEditingItemId(item.id);
      toast.success(`${getItemTypeLabel(item)} added.`);
    },
    onError: (error) => {
      toast.error(toErrorMessage(error, "Something went wrong."));
    },
    onSettled: () => {
      setPendingItemId(null);
      void invalidatePlanItems();
    },
  });

  const addSongMutation = useMutation({
    mutationFn: async (song: SongCatalogEntry) => {
      if (!serviceTypeId || !planId) {
        throw new Error("A service type and plan must be selected.");
      }

      const item = await postJson<SerializedPlanItem>("/api/plan-items", {
        service_type_id: serviceTypeId,
        plan_id: planId,
        song_id: song.id,
      });

      return hydratePlanItem(item);
    },
    onMutate: (song) => {
      setPendingSongId(song.id);
    },
    onSuccess: (item) => {
      queryClient.setQueryData<PlanItem[]>(queryKey, (current = EMPTY_PLAN_ITEMS) =>
        appendPlanItem(current, item)
      );
      setEditingItemId(item.id);
      setSongPickerOpen(false);
      toast.success("Song added to plan.");
    },
    onError: (error) => {
      toast.error(toErrorMessage(error, "Something went wrong."));
    },
    onSettled: () => {
      setPendingSongId(null);
      void invalidatePlanItems();
    },
  });

  const deleteItemMutation = useMutation<
    void,
    unknown,
    string,
    { snapshot: PlanItemsOptimisticSnapshot | undefined; deletedItemId: string }
  >({
    mutationFn: async (itemId) => {
      if (!serviceTypeId || !planId) {
        throw new Error("A service type and plan must be selected.");
      }

      await deleteJson<{ success: boolean }>(
        buildDeletePlanItemUrl(itemId, serviceTypeId, planId)
      );
    },
    onMutate: async (itemId) => {
      setPendingItemId(itemId);
      await queryClient.cancelQueries({ queryKey });

      return {
        deletedItemId: itemId,
        snapshot: applyPlanItemsOptimisticUpdate(queryClient, queryKey, (current) =>
          removePlanItem(current, itemId)
        ),
      };
    },
    onError: (error, _itemId, context) => {
      restorePlanItemsSnapshot(queryClient, queryKey, context?.snapshot);
      toast.error(toErrorMessage(error, "Something went wrong."));
    },
    onSuccess: (_result, itemId) => {
      if (editingItemId === itemId) {
        setEditingItemId(null);
      }
      toast.success("Item removed.");
    },
    onSettled: () => {
      setPendingItemId(null);
      void invalidatePlanItems();
    },
  });

  const reorderItemsMutation = useMutation<
    void,
    unknown,
    PlanItem[],
    { snapshot: PlanItemsOptimisticSnapshot | undefined }
  >({
    mutationFn: async (nextItems) => {
      if (!serviceTypeId || !planId) {
        throw new Error("A service type and plan must be selected.");
      }

      await postJson<{ success: boolean }>("/api/plan-items/reorder", {
        service_type_id: serviceTypeId,
        plan_id: planId,
        sequence: nextItems.map((item) => item.id),
      });
    },
    onMutate: async (nextItems) => {
      setPendingItemId("reorder");
      await queryClient.cancelQueries({ queryKey });

      return {
        snapshot: applyPlanItemsOptimisticUpdate(queryClient, queryKey, () => nextItems),
      };
    },
    onError: (error, _nextItems, context) => {
      restorePlanItemsSnapshot(queryClient, queryKey, context?.snapshot);
      toast.error(toErrorMessage(error, "Something went wrong."));
    },
    onSuccess: () => {
      toast.success("Plan order saved.");
    },
    onSettled: () => {
      setPendingItemId(null);
      void invalidatePlanItems();
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({
      item,
      draft,
      length,
    }: {
      item: PlanItem;
      draft: DraftState;
      length: number | null;
    }) => {
      if (!serviceTypeId || !planId) {
        throw new Error("A service type and plan must be selected.");
      }

      const itemResponse = await patchJson<SerializedPlanItem>(`/api/plan-items/${item.id}`, {
        service_type_id: serviceTypeId,
        plan_id: planId,
        title: item.song ? item.title : draft.title,
        service_position: draft.servicePosition,
        length: length && length > 0 ? length : null,
        description: draft.description,
        song_id: undefined,
        arrangement_id: draft.arrangementId || undefined,
        key_id: draft.keyId || undefined,
      });

      return hydratePlanItem(itemResponse);
    },
    onSuccess: (updatedItem) => {
      queryClient.setQueryData<PlanItem[]>(queryKey, (current = EMPTY_PLAN_ITEMS) =>
        replacePlanItem(current, updatedItem)
      );
    },
    onSettled: () => {
      void invalidatePlanItems();
    },
  });

  return {
    items,
    isLoading,
    editingItemId,
    editingItem: editingItemId ? items.find((item) => item.id === editingItemId) ?? null : null,
    songPickerOpen,
    pendingItemId,
    pendingSongId,
    isSavingItem: updateItemMutation.isPending,
    setEditingItemId,
    setSongPickerOpen,
    createBasicItem: (kind: "header" | "item") => createItemMutation.mutateAsync(kind),
    addSongToPlan: (song: SongCatalogEntry) => addSongMutation.mutateAsync(song),
    deleteItem: (itemId: string) => deleteItemMutation.mutateAsync(itemId),
    reorderItems: (nextItems: PlanItem[]) => reorderItemsMutation.mutateAsync(nextItems),
    saveItem: ({
      item,
      draft,
      length,
    }: {
      item: PlanItem;
      draft: DraftState;
      length: number | null;
    }) => updateItemMutation.mutateAsync({ item, draft, length }),
  };
}
