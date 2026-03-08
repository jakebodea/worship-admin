"use client";

import {
  closestCenter,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FileMusic, Music4, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatLength,
  getItemTone,
  getItemTypeLabel,
  getServicePositionLabel,
} from "@/components/schedule/plan-tab-helpers";
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
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const reorderDisabled = pendingItemId === "reorder";
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 160, tolerance: 10 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveItemId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveItemId(null);

    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;

    if (!overId || activeId === overId) return;

    const nextItems = reorderPlanItems(items, activeId, overId);
    if (nextItems === items) return;

    await onReorderItems(nextItems);
  };

  return (
    <ScrollArea className="min-h-0 flex-1">
      {isLoading ? (
        <div className="space-y-3 pb-28 pr-0 sm:pb-6 sm:pr-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="mx-0 border-dashed px-6 py-10 text-center sm:mr-3">
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
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragCancel={() => setActiveItemId(null)}
          onDragEnd={(event) => void handleDragEnd(event)}
        >
          <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 pb-28 pr-0 sm:space-y-0 sm:pb-6 sm:pr-3">
              {items.map((item) => (
                <SortablePlanItem
                  key={item.id}
                  item={item}
                  isBusy={pendingItemId === item.id}
                  isDragging={activeItemId === item.id}
                  reorderDisabled={reorderDisabled}
                  onEdit={() => onEditItem(item.id)}
                  onDelete={() => onDeleteItem(item.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </ScrollArea>
  );
}

interface SortablePlanItemProps {
  item: PlanItem;
  isBusy: boolean;
  isDragging: boolean;
  reorderDisabled: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void> | void;
}

function SortablePlanItem({
  item,
  isBusy,
  isDragging,
  reorderDisabled,
  onEdit,
  onDelete,
}: SortablePlanItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: item.id,
    disabled: reorderDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(
      transform
        ? {
            ...transform,
            scaleX: isSortableDragging ? 1.01 : 1,
            scaleY: isSortableDragging ? 1.01 : 1,
          }
        : null
    ),
    transition: transition ?? "transform 180ms cubic-bezier(0.2, 0, 0, 1)",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-[transform,box-shadow,opacity] duration-200 ease-out",
        isSortableDragging && "z-20 opacity-95 shadow-2xl"
      )}
    >
      <PlanItemCard
        item={item}
        isBusy={isBusy}
        isDragged={isDragging || isSortableDragging}
        dragAttributes={attributes}
        dragListeners={listeners}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

interface PlanItemCardProps {
  item: PlanItem;
  isBusy: boolean;
  isDragged: boolean;
  dragAttributes: ReturnType<typeof useSortable>["attributes"];
  dragListeners: ReturnType<typeof useSortable>["listeners"];
  onEdit: () => void;
  onDelete: () => Promise<void> | void;
}

function PlanItemCard({
  item,
  isBusy,
  isDragged,
  dragAttributes,
  dragListeners,
  onEdit,
  onDelete,
}: PlanItemCardProps) {
  const tone = getItemTone(item);
  const itemTypeLabel = getItemTypeLabel(item);
  const servicePositionLabel = getServicePositionLabel(item.servicePosition);
  const lengthLabel = formatLength(item.length);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border transition-[background-color,border-color,box-shadow] sm:rounded-none sm:border-x sm:border-t-0 sm:last:border-b",
        tone.row,
        isDragged && "border-primary/30 bg-muted/80 shadow-lg"
      )}
    >
      <div
        {...dragAttributes}
        {...dragListeners}
        className={cn(
          "cursor-grab touch-manipulation transition-colors active:cursor-grabbing",
          tone.header,
          !isDragged && tone.hover
        )}
      >
        <div className="hidden items-center gap-3 px-4 py-3 sm:flex">
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
                {lengthLabel ? <Badge variant="outline">{lengthLabel}</Badge> : null}
              </div>
              <div className="text-muted-foreground mt-1 flex flex-wrap gap-2 text-xs">
                {item.description ? <span className="truncate">{item.description}</span> : null}
              </div>
            </div>
          </button>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onDelete}
              disabled={isBusy}
              aria-label={`Delete ${item.title || "plan item"}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 py-4 sm:hidden">
          <div className="flex items-start gap-3">
            <button type="button" onClick={onEdit} className="min-w-0 flex-1 text-left">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 text-base font-semibold leading-tight break-words">
                  {item.title || "Untitled item"}
                </p>
                <Badge variant="secondary" className="shrink-0">
                  {itemTypeLabel}
                </Badge>
              </div>
              {item.arrangement ? (
                <p className="text-muted-foreground mt-2 text-sm">{item.arrangement.name}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline">{servicePositionLabel}</Badge>
                {item.key ? <Badge variant="outline">{item.key.name}</Badge> : null}
                {lengthLabel ? <Badge variant="outline">{lengthLabel}</Badge> : null}
              </div>
              {item.description ? (
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed break-words">
                  {item.description}
                </p>
              ) : null}
            </button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onDelete}
              disabled={isBusy}
              aria-label={`Delete ${item.title || "plan item"}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
