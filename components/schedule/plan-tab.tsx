"use client";

import {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
  type PointerEvent,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  FileMusic,
  GripVertical,
  LoaderCircle,
  Music4,
  Plus,
  Trash2,
  Type,
} from "lucide-react";
import { SongPickerDialog } from "@/components/schedule/song-picker-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlanItems } from "@/hooks/use-plan-items";
import { useSongOptions } from "@/hooks/use-song-options";
import { deleteJson, patchJson, postJson } from "@/lib/http/client";
import { queryKeys } from "@/lib/query-keys";
import type { ArrangementOption, PlanItem, SongCatalogEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

interface PlanTabProps {
  serviceTypeId: string | null;
  planId: string | null;
}

type DraftState = {
  title: string;
  lengthText: string;
  servicePosition: string;
  description: string;
  arrangementId: string;
  keyId: string;
};

const EMPTY_PLAN_ITEMS: PlanItem[] = [];
const textareaClassName =
  "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]";
const NONE_VALUE = "__none__";
const TOOLBAR_WIDTH_ESTIMATE = 340;
const TOOLBAR_HEIGHT_ESTIMATE = 56;
const TOOLBAR_MIN_MARGIN = 12;

type ToolbarDragState = {
  pointerId: number;
  startX: number;
  startY: number;
  startRight: number;
  startBottom: number;
};

function buildDraft(item: PlanItem): DraftState {
  const length = item.length ?? 0;
  const normalizedLength = Math.max(0, Math.floor(length));
  const hours = Math.floor(normalizedLength / 3600);
  const minutes = Math.floor((normalizedLength % 3600) / 60);
  const seconds = normalizedLength % 60;
  const lengthText =
    hours > 0
      ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      : `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return {
    title: item.title,
    lengthText,
    servicePosition: item.servicePosition || "during",
    description: item.description,
    arrangementId: item.arrangement?.id ?? "",
    keyId: item.key?.id ?? "",
  };
}

function parseLengthText(value: string): { length: number | null; error: string | null } {
  const normalized = value.trim();
  if (!normalized) return { length: null, error: null };

  const parts = normalized.split(":").map((part) => part.trim());
  if (parts.some((part) => part.length === 0)) {
    return { length: null, error: "Length must be in mm:ss or h:mm:ss format." };
  }

  const numericParts = parts.map((part) => {
    if (!/^\d+$/.test(part)) return Number.NaN;
    return Number(part);
  });
  if (numericParts.some((part) => Number.isNaN(part) || part < 0)) {
    return { length: null, error: "Length must be numeric values separated by ':'." };
  }

  if (parts.length === 1) {
    return { length: numericParts[0], error: null };
  }

  if (parts.length === 2) {
    const [minutes, seconds] = numericParts;
    return { length: minutes * 60 + seconds, error: null };
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = numericParts;
    return { length: hours * 3600 + minutes * 60 + seconds, error: null };
  }

  return { length: null, error: "Length must be in mm:ss or h:mm:ss format." };
}

function formatLength(length: number | null) {
  if (!length || length <= 0) return null;
  const minutes = Math.floor(length / 60);
  const seconds = length % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function moveItem(items: PlanItem[], fromIndex: number, toIndex: number): PlanItem[] {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  if (!moved) return items;
  next.splice(toIndex, 0, moved);
  return next.map((item, index) => ({
    ...item,
    sequence: index + 1,
  }));
}

function getItemTone(item: PlanItem) {
  if (item.itemType === "header") {
    return {
      row: "bg-muted/60",
      header: "bg-muted/80",
      hover: "hover:ring-border/80 hover:ring-1 hover:ring-inset",
      content: "bg-background",
    };
  }

  return {
    row: "bg-background",
    header: "bg-background",
    hover: "hover:bg-accent/50",
    content: "bg-background",
  };
}

function getItemTypeLabel(item: PlanItem) {
  if (item.itemType === "song") return "Song";
  if (item.itemType === "header") return "Header";
  if (item.itemType === "item") return "Item";
  return item.itemType || "Item";
}

export function PlanTab({ serviceTypeId, planId }: PlanTabProps) {
  const queryClient = useQueryClient();
  const { data: itemsData, isLoading } = usePlanItems(serviceTypeId, planId);
  const items = itemsData ?? EMPTY_PLAN_ITEMS;
  const [localItems, setLocalItems] = useState<PlanItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [songPickerOpen, setSongPickerOpen] = useState(false);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const [pendingSongId, setPendingSongId] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ right: 24, bottom: 24 });
  const queryKey = queryKeys.planItems(serviceTypeId, planId);
  const toolbarDragRef = useRef<ToolbarDragState | null>(null);

  useEffect(() => {
    const handleToolbarPointerMove = (event: PointerEvent) => {
      if (!toolbarDragRef.current || typeof window === "undefined") return;
      const dragState = toolbarDragRef.current;
      if (event.pointerId !== dragState.pointerId) return;

      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;
      const maxRight = Math.max(TOOLBAR_MIN_MARGIN, window.innerWidth - TOOLBAR_WIDTH_ESTIMATE);
      const maxBottom = Math.max(TOOLBAR_MIN_MARGIN, window.innerHeight - TOOLBAR_HEIGHT_ESTIMATE);

      setToolbarPosition({
        right: Math.max(TOOLBAR_MIN_MARGIN, Math.min(maxRight, dragState.startRight - deltaX)),
        bottom: Math.max(TOOLBAR_MIN_MARGIN, Math.min(maxBottom, dragState.startBottom - deltaY)),
      });
    };

    const handleToolbarPointerEnd = (event: PointerEvent) => {
      if (!toolbarDragRef.current) return;
      if (event.pointerId !== toolbarDragRef.current.pointerId) return;
      toolbarDragRef.current = null;
    };

    window.addEventListener("pointermove", handleToolbarPointerMove);
    window.addEventListener("pointerup", handleToolbarPointerEnd);
    window.addEventListener("pointercancel", handleToolbarPointerEnd);

    return () => {
      window.removeEventListener("pointermove", handleToolbarPointerMove);
      window.removeEventListener("pointerup", handleToolbarPointerEnd);
      window.removeEventListener("pointercancel", handleToolbarPointerEnd);
    };
  }, []);

  const handleToolbarDragStart = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toolbarDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRight: toolbarPosition.right,
      startBottom: toolbarPosition.bottom,
    };
  };

  useEffect(() => {
    setLocalItems((current) => (current === items ? current : items));
  }, [items]);

  const syncLocalItems = (nextItems: PlanItem[]) => {
    setLocalItems(nextItems);
    queryClient.setQueryData(queryKey, nextItems);
  };

  const invalidatePlanItems = () =>
    queryClient.invalidateQueries({
      queryKey,
    });

  const handleError = (error: unknown) => {
    toast.error(error instanceof Error ? error.message : "Something went wrong.");
  };

  const handleCreateBasicItem = async (kind: "header" | "item") => {
    if (!serviceTypeId || !planId) return;
    setPendingItemId(`create-${kind}`);

    try {
      const item = await postJson<PlanItem>("/api/plan-items", {
        service_type_id: serviceTypeId,
        plan_id: planId,
        item_type: kind,
        title: kind === "header" ? "New Header" : "New Item",
      });

      const nextItems = [...localItems, item].toSorted((a, b) => a.sequence - b.sequence);
      syncLocalItems(nextItems);
      setEditingItemId(item.id);
      toast.success(`${getItemTypeLabel(item)} added.`);
      startTransition(() => {
        invalidatePlanItems();
      });
    } catch (error) {
      handleError(error);
    } finally {
      setPendingItemId(null);
    }
  };

  const handleSongSelect = async (song: SongCatalogEntry) => {
    if (!serviceTypeId || !planId) return;

    setPendingSongId(song.id);

    try {
      const created = await postJson<PlanItem>("/api/plan-items", {
        service_type_id: serviceTypeId,
        plan_id: planId,
        song_id: song.id,
      });
      const nextItems = [...localItems, created].toSorted((a, b) => a.sequence - b.sequence);
      syncLocalItems(nextItems);
      setEditingItemId(created.id);
      toast.success("Song added to plan.");

      setSongPickerOpen(false);
      startTransition(() => {
        invalidatePlanItems();
      });
    } catch (error) {
      handleError(error);
    } finally {
      setPendingSongId(null);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!serviceTypeId || !planId) return;
    setPendingItemId(itemId);

    try {
      await deleteJson<{ success: boolean }>(`/api/plan-items/${itemId}`, {
        service_type_id: serviceTypeId,
        plan_id: planId,
      });
      const nextItems = localItems
        .filter((item) => item.id !== itemId)
        .map((item, index) => ({ ...item, sequence: index + 1 }));
      syncLocalItems(nextItems);
      if (editingItemId === itemId) {
        setEditingItemId(null);
      }
      toast.success("Item removed.");
      startTransition(() => {
        invalidatePlanItems();
      });
    } catch (error) {
      handleError(error);
    } finally {
      setPendingItemId(null);
    }
  };

  const persistReorder = async (nextItems: PlanItem[]) => {
    if (!serviceTypeId || !planId) return;
    syncLocalItems(nextItems);
    setPendingItemId("reorder");

    try {
      await postJson<{ success: boolean }>("/api/plan-items/reorder", {
        service_type_id: serviceTypeId,
        plan_id: planId,
        sequence: nextItems.map((item) => item.id),
      });
      toast.success("Plan order saved.");
      startTransition(() => {
        invalidatePlanItems();
      });
    } catch (error) {
      syncLocalItems(items);
      handleError(error);
    } finally {
      setPendingItemId(null);
    }
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>, itemId: string) => {
    event.dataTransfer.effectAllowed = "move";
    setDraggedItemId(itemId);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>, targetItemId: string) => {
    event.preventDefault();
    if (!draggedItemId || draggedItemId === targetItemId) return;

    const fromIndex = localItems.findIndex((item) => item.id === draggedItemId);
    const toIndex = localItems.findIndex((item) => item.id === targetItemId);
    setDraggedItemId(null);
    if (fromIndex === -1 || toIndex === -1) return;

    await persistReorder(moveItem(localItems, fromIndex, toIndex));
  };

  const openAddSong = () => {
    setSongPickerOpen(true);
  };

  return (
    <>
      <SongPickerDialog
        open={songPickerOpen}
        onOpenChange={(open) => {
          setSongPickerOpen(open);
        }}
        serviceTypeId={serviceTypeId}
        onSelectSong={handleSongSelect}
        pendingSongId={pendingSongId}
      />

      <div className="flex h-full min-h-0 flex-col gap-4">
        <div
          className="fixed z-40 flex items-center gap-2 rounded-md border bg-background px-4 py-2 shadow-sm"
          style={{
            right: `${toolbarPosition.right}px`,
            bottom: `${toolbarPosition.bottom}px`,
          }}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="cursor-grab touch-none"
            onPointerDown={handleToolbarDragStart}
          >
            <GripVertical className="size-4" />
          </Button>
          <Button type="button" variant="ghost" onClick={openAddSong}>
            <Music4 className="size-4" />
            Add Song
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleCreateBasicItem("header")}
            disabled={pendingItemId === "create-header"}
          >
            <Type className="size-4" />
            Add Header
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleCreateBasicItem("item")}
            disabled={pendingItemId === "create-item"}
          >
            <Plus className="size-4" />
            Add Item
          </Button>
          {pendingItemId === "reorder" ? (
            <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
              <LoaderCircle className="size-4 animate-spin" />
              Saving order...
            </span>
          ) : null}
        </div>

        <ScrollArea className="min-h-0 flex-1 pr-3">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : localItems.length === 0 ? (
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
                  <Button type="button" onClick={openAddSong}>
                    <Music4 className="size-4" />
                    Add Song
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleCreateBasicItem("header")}>
                    Add Header
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleCreateBasicItem("item")}>
                    Add Item
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="overflow-hidden rounded-lg border bg-background">
              {localItems.map((item) => (
                <div
                  key={item.id}
                  draggable={pendingItemId !== "reorder"}
                  onDragStart={(event) => handleDragStart(event, item.id)}
                  onDragEnd={() => setDraggedItemId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, item.id)}
                  className="border-b last:border-b-0"
                >
                  <PlanItemCard
                    item={item}
                    isBusy={pendingItemId === item.id}
                    isDragged={draggedItemId === item.id}
                    onEdit={() => setEditingItemId(item.id)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </div>
              ))}
            </div>
          )}
          <PlanItemEditDialog
            item={
              editingItemId
                ? localItems.find((item) => item.id === editingItemId) ?? null
                : null
            }
            open={Boolean(editingItemId)}
            serviceTypeId={serviceTypeId}
            planId={planId}
            onOpenChange={(open) => {
              if (!open) setEditingItemId(null);
            }}
            onSave={(updatedItem) => {
              const nextItems = localItems.map((current) =>
                current.id === updatedItem.id ? updatedItem : current
              );
              syncLocalItems(nextItems);
              setEditingItemId(null);
              startTransition(() => {
                invalidatePlanItems();
              });
            }}
          />
        </ScrollArea>
      </div>
    </>
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
    <div
      className={cn(
        "transition-colors",
        tone.row,
        isDragged && "bg-muted/80"
      )}
    >
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
              {formatLength(item.length) ? (
                <Badge variant="outline">{formatLength(item.length)}</Badge>
              ) : null}
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

interface PlanItemEditDialogProps {
  item: PlanItem | null;
  serviceTypeId: string | null;
  planId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: PlanItem) => void;
}

function PlanItemEditDialog({
  item,
  serviceTypeId,
  planId,
  open,
  onOpenChange,
  onSave,
}: PlanItemEditDialogProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [draft, setDraft] = useState<DraftState>(() => {
    if (!item) {
      return {
        title: "",
        lengthText: "",
        servicePosition: "during",
        description: "",
        arrangementId: "",
        keyId: "",
      };
    }
    return buildDraft(item);
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { data: songOptions, isLoading: songOptionsLoading } = useSongOptions(
    open && item?.song ? item.song.id : null,
    serviceTypeId
  );

  useEffect(() => {
    if (!item) return;
    setDraft(buildDraft(item));
  }, [item]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const onMatch = () => setIsMobile(mediaQuery.matches);
    onMatch();
    mediaQuery.addEventListener("change", onMatch);
    return () => mediaQuery.removeEventListener("change", onMatch);
  }, []);

  const arrangements = useMemo(() => songOptions?.arrangements ?? [], [songOptions?.arrangements]);
  const selectedArrangement = useMemo(
    () => arrangements.find((arrangement) => arrangement.id === draft.arrangementId) ?? null,
    [arrangements, draft.arrangementId]
  );
  const keyOptions = selectedArrangement?.keys ?? [];

  useEffect(() => {
    if (!item || !songOptions || arrangements.length === 0) return;

    setDraft((current) => {
      let nextArrangementId = current.arrangementId || songOptions.suggestedArrangementId || "";
      const arrangement = arrangements.find((option) => option.id === nextArrangementId) ?? null;
      let nextKeyId = current.keyId;

      if (!arrangement) {
        nextArrangementId = "";
        nextKeyId = "";
      } else if (!arrangement.keys.some((key) => key.id === nextKeyId)) {
        nextKeyId =
          arrangement.keys.find((key) => key.id === songOptions.suggestedKeyId)?.id ||
          arrangement.keys[0]?.id ||
          "";
      }

      if (
        nextArrangementId === current.arrangementId &&
        nextKeyId === current.keyId
      ) {
        return current;
      }

      return {
        ...current,
        arrangementId: nextArrangementId,
        keyId: nextKeyId,
      };
    });
  }, [arrangements, item, songOptions]);

  const handleSubmit = async () => {
    if (!item || !serviceTypeId || !planId) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      const parsed = parseLengthText(draft.lengthText);
      if (parsed.error) {
        setSaveError(parsed.error);
        return;
      }

      const length = parsed.length;
      const updated = await patchJson<PlanItem>(`/api/plan-items/${item.id}`, {
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

      onSave(updated);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save this item.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={
          isMobile
            ? {
                left: 0,
                right: 0,
                top: "auto",
                bottom: 0,
                transform: "translateX(0)",
              }
            : undefined
        }
        className={cn(
          "max-h-[92vh] overflow-y-auto rounded-t-xl border-b-0 p-4 sm:left-1/2 sm:max-w-2xl sm:translate-x-[-50%] sm:top-[50%] sm:w-full sm:rounded-lg",
          isMobile ? "w-[100vw] max-w-[100vw]" : "w-[95vw] max-w-[95vw]"
        )}
      >
        <DialogHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <DialogTitle>
            {item.song ? (
              <a
                href={`https://services.planningcenteronline.com/songs/${item.song.id}${
                  item.arrangement ? `/arrangements/${item.arrangement.id}` : ""
                }`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary underline-offset-4 hover:underline"
              >
                {item.song.title}
              </a>
            ) : (
              "Plan item"
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 lg:grid-cols-2">
          {!item.song ? (
            <Field label="Title" className="lg:col-span-2">
              <Input
                placeholder={item.itemType === "header" ? "Header title" : "Item title"}
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              />
            </Field>
          ) : null}

          {item.song ? (
            <Field label="Arrangement">
              {songOptionsLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Select
                  value={draft.arrangementId}
                  onValueChange={(value) => {
                    const normalizedValue = value === NONE_VALUE ? "" : value;
                    const nextArrangement = arrangements.find((arrangement) => arrangement.id === value);
                    setDraft((current) => ({
                      ...current,
                      arrangementId: normalizedValue,
                      keyId: nextArrangement?.keys[0]?.id ?? "",
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select arrangement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE}>No arrangement</SelectItem>
                    {arrangements.map((arrangement: ArrangementOption) => (
                      <SelectItem key={arrangement.id} value={arrangement.id}>
                        {arrangement.name}
                        {arrangement.archived ? " (archived)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          ) : null}

          {item.song ? (
            <Field label="Key">
              {songOptionsLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Select
                  value={draft.keyId}
                  onValueChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      keyId: value === NONE_VALUE ? "" : value,
                    }))
                  }
                  disabled={!selectedArrangement || keyOptions.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select key" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE}>No key</SelectItem>
                    {keyOptions.map((key) => (
                      <SelectItem key={key.id} value={key.id}>
                        {key.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          ) : null}

          <Field label="Length">
            <Input
              placeholder="4:35 or 1:5:21"
              value={draft.lengthText}
              onChange={(event) => setDraft((current) => ({ ...current, lengthText: event.target.value }))}
            />
          </Field>

          <Field label="Service Position">
            <Select
              value={draft.servicePosition}
              onValueChange={(value) => setDraft((current) => ({ ...current, servicePosition: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select service position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre">Pre-service</SelectItem>
                <SelectItem value="during">During service</SelectItem>
                <SelectItem value="post">Post-service</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Description" className="lg:col-span-2">
            <textarea
              className={textareaClassName}
              value={draft.description}
              onChange={(event) =>
                setDraft((current) => ({ ...current, description: event.target.value }))
              }
            />
          </Field>
        </div>

        {saveError ? <p className="text-destructive mt-3 text-sm">{saveError}</p> : null}

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Close
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("grid gap-1.5", className)}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
