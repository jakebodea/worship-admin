"use client";

import {
  closestCenter,
  DndContext,
  DragOverlay,
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
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const reorderDisabled = pendingItemId === "reorder";
  const activeItem = items.find((item) => item.id === activeItemId) ?? null;
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
            <div className="pb-28 sm:pb-6 sm:pr-3">
              <div className="overflow-hidden rounded-lg border bg-background">
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
            </div>
          </SortableContext>
          <DragOverlay zIndex={60}>
            {activeItem ? (
              <div className="overflow-hidden rounded-lg border bg-background rotate-[0.2deg] shadow-2xl">
                <PlanItemCard
                  item={activeItem}
                  isBusy={pendingItemId === activeItem.id}
                  isDragged
                  onEdit={() => onEditItem(activeItem.id)}
                  onDelete={() => onDeleteItem(activeItem.id)}
                />
              </div>
            ) : null}
          </DragOverlay>
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
        "relative border-b last:border-b-0 transition-[transform,box-shadow,opacity] duration-200 ease-out",
        isSortableDragging && "z-20 opacity-0"
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
  dragAttributes?: ReturnType<typeof useSortable>["attributes"];
  dragListeners?: ReturnType<typeof useSortable>["listeners"];
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
  const lengthLabel = formatLength(item.length);
  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onEdit();
  };

  return (
    <div
      className={cn(
        "transition-[background-color,box-shadow] duration-200",
        tone.row,
        isDragged && "bg-muted/80 shadow-lg"
      )}
    >
      <div
        {...dragAttributes}
        {...dragListeners}
        role="button"
        tabIndex={0}
        onClick={onEdit}
        onKeyDown={handleCardKeyDown}
        className={cn(
          "cursor-grab touch-manipulation select-none transition-colors active:cursor-grabbing",
          tone.header,
          !isDragged && tone.hover
        )}
      >
        <div className="hidden items-center gap-3 px-4 py-3 sm:flex">
          <div className="flex min-w-0 flex-1 items-center gap-3 text-left">
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
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="group"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                void onDelete();
              }}
              disabled={isBusy}
              aria-label={`Delete ${item.title || "plan item"}`}
            >
              <Trash2 className="size-4 transition-colors group-hover:text-destructive" />
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-3 px-4 py-3 sm:hidden">
          <div className="min-w-0 flex-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <p className="min-w-0 break-words font-semibold">{item.title || "Untitled item"}</p>
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
            {item.description ? (
              <div className="text-muted-foreground mt-1 flex flex-wrap gap-2 text-xs">
                <span className="break-words">{item.description}</span>
              </div>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="group shrink-0"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              void onDelete();
            }}
            disabled={isBusy}
            aria-label={`Delete ${item.title || "plan item"}`}
          >
            <Trash2 className="size-4 transition-colors group-hover:text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}
