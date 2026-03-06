"use client";

import { useState, type DragEvent } from "react";
import { FileMusic, GripVertical, Music4, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { formatLength, getItemTone } from "@/components/schedule/plan-tab-helpers";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { reorderPlanItems } from "@/lib/plan-items-query-state";
import type { PlanItem } from "@/lib/types";

interface PlanItemListProps {
  items: PlanItem[];
  isLoading: boolean;
  pendingItemId: string | null;
  onAddSong: () => void;
  onAddHeader: () => void;
  onAddItem: () => void;
  onEditItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => Promise<void> | void;
  onReorderItems: (items: PlanItem[]) => Promise<void> | void;
}

export function PlanItemList({
  items,
  isLoading,
  pendingItemId,
  onAddSong,
  onAddHeader,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onReorderItems,
}: PlanItemListProps) {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const handleDragStart = (event: DragEvent<HTMLDivElement>, itemId: string) => {
    event.dataTransfer.effectAllowed = "move";
    setDraggedItemId(itemId);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>, targetItemId: string) => {
    event.preventDefault();
    if (!draggedItemId || draggedItemId === targetItemId) return;

    const nextItems = reorderPlanItems(items, draggedItemId, targetItemId);
    setDraggedItemId(null);
    if (nextItems === items) return;

    await onReorderItems(nextItems);
  };

  return (
    <ScrollArea className="min-h-0 flex-1 pr-3">
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="border-dashed px-6 py-10 text-center">
          <div className="mx-auto flex max-w-md flex-col items-center gap-3">
            <div className="bg-muted text-muted-foreground rounded-full p-3">
              <FileMusic className="size-6" />
            </div>
            <div>
              <p className="text-base font-semibold">This plan does not have any structure yet.</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Start by adding a song, a header, or a custom item.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button type="button" onClick={onAddSong}>
                <Music4 className="size-4" />
                Add Song
              </Button>
              <Button type="button" variant="outline" onClick={onAddHeader}>
                Add Header
              </Button>
              <Button type="button" variant="outline" onClick={onAddItem}>
                Add Item
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-background">
          {items.map((item) => (
            <div
              key={item.id}
              draggable={pendingItemId !== "reorder"}
              onDragStart={(event) => handleDragStart(event, item.id)}
              onDragEnd={() => setDraggedItemId(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => void handleDrop(event, item.id)}
              className="border-b last:border-b-0"
            >
              <PlanItemCard
                item={item}
                isBusy={pendingItemId === item.id}
                isDragged={draggedItemId === item.id}
                onEdit={() => onEditItem(item.id)}
                onDelete={() => onDeleteItem(item.id)}
              />
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}

interface PlanItemCardProps {
  item: PlanItem;
  isBusy: boolean;
  isDragged: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void> | void;
}

function PlanItemCard({
  item,
  isBusy,
  isDragged,
  onEdit,
  onDelete,
}: PlanItemCardProps) {
  const tone = getItemTone(item);
  return (
    <div className={cn("transition-colors", tone.row, isDragged && "bg-muted/80")}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 transition-colors",
          tone.header,
          !isDragged && tone.hover
        )}
      >
        <div className="text-muted-foreground cursor-grab">
          <GripVertical className="size-4" />
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold">{item.title || "Untitled item"}</p>
              {item.arrangement ? (
                <span className="text-muted-foreground/80 flex items-center gap-1 text-sm">
                  <span aria-hidden="true" className="opacity-60">
                    |
                  </span>
                  <span>{item.arrangement.name}</span>
                </span>
              ) : null}
              {item.key ? (
                <Badge
                  variant="outline"
                  className="h-6 min-w-6 rounded-full px-2 text-[11px] font-semibold shadow-xs"
                >
                  {item.key.name}
                </Badge>
              ) : null}
              {formatLength(item.length) ? <Badge variant="outline">{formatLength(item.length)}</Badge> : null}
            </div>
            <div className="text-muted-foreground mt-1 flex flex-wrap gap-2 text-xs">
              {item.description ? <span className="truncate">{item.description}</span> : null}
            </div>
          </div>
        </button>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={onDelete} disabled={isBusy}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
