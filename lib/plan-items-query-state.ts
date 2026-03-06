import type { QueryClient } from "@tanstack/react-query";
import type { PlanItem } from "@/lib/types";

export type PlanItemsQueryKey = readonly unknown[];

export interface PlanItemsOptimisticSnapshot {
  previousItems: PlanItem[];
  nextItems: PlanItem[];
}

export function appendPlanItem(items: PlanItem[], item: PlanItem): PlanItem[] {
  return [...items, item].toSorted((a, b) => a.sequence - b.sequence);
}

export function replacePlanItem(items: PlanItem[], updatedItem: PlanItem): PlanItem[] {
  return items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
}

export function removePlanItem(items: PlanItem[], itemId: string): PlanItem[] {
  return items
    .filter((item) => item.id !== itemId)
    .map((item, index) => ({ ...item, sequence: index + 1 }));
}

export function movePlanItem(items: PlanItem[], fromIndex: number, toIndex: number): PlanItem[] {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  if (!movedItem) return items;

  nextItems.splice(toIndex, 0, movedItem);
  return nextItems.map((item, index) => ({
    ...item,
    sequence: index + 1,
  }));
}

export function reorderPlanItems(
  items: PlanItem[],
  draggedItemId: string,
  targetItemId: string
): PlanItem[] {
  if (draggedItemId === targetItemId) return items;

  const fromIndex = items.findIndex((item) => item.id === draggedItemId);
  const toIndex = items.findIndex((item) => item.id === targetItemId);
  if (fromIndex === -1 || toIndex === -1) return items;

  return movePlanItem(items, fromIndex, toIndex);
}

export function applyPlanItemsOptimisticUpdate(
  queryClient: QueryClient,
  queryKey: PlanItemsQueryKey,
  update: (items: PlanItem[]) => PlanItem[]
): PlanItemsOptimisticSnapshot {
  const previousItems = queryClient.getQueryData<PlanItem[]>(queryKey) ?? [];
  const nextItems = update(previousItems);

  queryClient.setQueryData(queryKey, nextItems);
  return {
    previousItems,
    nextItems,
  };
}

export function restorePlanItemsSnapshot(
  queryClient: QueryClient,
  queryKey: PlanItemsQueryKey,
  snapshot: PlanItemsOptimisticSnapshot | undefined
) {
  if (!snapshot) return;
  queryClient.setQueryData(queryKey, snapshot.previousItems);
}
