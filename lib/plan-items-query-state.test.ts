import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import {
  applyPlanItemsOptimisticUpdate,
  removePlanItem,
  reorderPlanItems,
  restorePlanItemsSnapshot,
} from "@/lib/plan-items-query-state";
import type { PlanItem } from "@/lib/types";

function createItem(id: string, sequence: number): PlanItem {
  return {
    id,
    title: `Item ${sequence}`,
    itemType: "item",
    sequence,
    servicePosition: "during",
    length: null,
    description: "",
    htmlDetails: "",
    customArrangementSequence: [],
    song: null,
    arrangement: null,
    key: null,
    layout: null,
  };
}

describe("plan item query state", () => {
  it("restores the previous cache snapshot after an optimistic reorder rollback", () => {
    const queryClient = new QueryClient();
    const queryKey = ["plan-items", "service-1", "plan-1"] as const;
    const items = [createItem("item-1", 1), createItem("item-2", 2)];

    queryClient.setQueryData(queryKey, items);

    const snapshot = applyPlanItemsOptimisticUpdate(queryClient, queryKey, (current) =>
      reorderPlanItems(current, "item-2", "item-1")
    );

    expect(queryClient.getQueryData<PlanItem[]>(queryKey)?.map((item) => item.id)).toEqual([
      "item-2",
      "item-1",
    ]);

    restorePlanItemsSnapshot(queryClient, queryKey, snapshot);

    expect(queryClient.getQueryData<PlanItem[]>(queryKey)?.map((item) => item.id)).toEqual([
      "item-1",
      "item-2",
    ]);
  });

  it("renumbers remaining items after an optimistic delete", () => {
    expect(
      removePlanItem([createItem("item-1", 1), createItem("item-2", 2), createItem("item-3", 3)], "item-2")
    ).toMatchObject([
      { id: "item-1", sequence: 1 },
      { id: "item-3", sequence: 2 },
    ]);
  });
});
