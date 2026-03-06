"use client";

import {
  startTransition,
  useEffect,
  useMemo,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  FileMusic,
  GripVertical,
  LayoutTemplate,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlanItems } from "@/hooks/use-plan-items";
import { useSongOptions } from "@/hooks/use-song-options";
import { deleteJson, patchJson, postJson } from "@/lib/http/client";
import { queryKeys } from "@/lib/query-keys";
import type { ArrangementOption, PlanItem, SongCatalogEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PlanTabProps {
  serviceTypeId: string | null;
  planId: string | null;
}

type DraftState = {
  title: string;
  length: string;
  servicePosition: string;
  description: string;
  htmlDetails: string;
  arrangementId: string;
  keyId: string;
  customArrangementSequenceText: string;
};

const textareaClassName =
  "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]";

function buildDraft(item: PlanItem): DraftState {
  return {
    title: item.title,
    length: item.length?.toString() ?? "",
    servicePosition: item.servicePosition || "during",
    description: item.description,
    htmlDetails: item.htmlDetails,
    arrangementId: item.arrangement?.id ?? "",
    keyId: item.key?.id ?? "",
    customArrangementSequenceText: item.customArrangementSequence.join(", "),
  };
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

function summarizeType(item: PlanItem) {
  if (item.itemType === "song") return "Song";
  if (item.itemType === "header") return "Header";
  if (item.itemType === "item") return "Item";
  return item.itemType || "Item";
}

export function PlanTab({ serviceTypeId, planId }: PlanTabProps) {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = usePlanItems(serviceTypeId, planId);
  const [localItems, setLocalItems] = useState<PlanItem[]>([]);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [songPickerOpen, setSongPickerOpen] = useState(false);
  const [replaceSongItemId, setReplaceSongItemId] = useState<string | null>(null);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const [pendingSongId, setPendingSongId] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const queryKey = queryKeys.planItems(serviceTypeId, planId);

  useEffect(() => {
    setLocalItems(items);
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
    setBanner({
      tone: "error",
      text: error instanceof Error ? error.message : "Something went wrong.",
    });
  };

  const handleCreateBasicItem = async (kind: "header" | "item") => {
    if (!serviceTypeId || !planId) return;
    setPendingItemId(`create-${kind}`);
    setBanner(null);

    try {
      const item = await postJson<PlanItem>("/api/plan-items", {
        service_type_id: serviceTypeId,
        plan_id: planId,
        item_type: kind,
        title: kind === "header" ? "New Header" : "New Item",
      });

      const nextItems = [...localItems, item].toSorted((a, b) => a.sequence - b.sequence);
      syncLocalItems(nextItems);
      setExpandedItemId(item.id);
      setBanner({ tone: "success", text: `${summarizeType(item)} added.` });
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
    setBanner(null);

    try {
      if (replaceSongItemId) {
        const updated = await patchJson<PlanItem>(`/api/plan-items/${replaceSongItemId}`, {
          service_type_id: serviceTypeId,
          plan_id: planId,
          song_id: song.id,
        });
        const nextItems = localItems.map((item) => (item.id === updated.id ? updated : item));
        syncLocalItems(nextItems);
        setExpandedItemId(updated.id);
        setBanner({ tone: "success", text: "Song updated." });
      } else {
        const created = await postJson<PlanItem>("/api/plan-items", {
          service_type_id: serviceTypeId,
          plan_id: planId,
          song_id: song.id,
        });
        const nextItems = [...localItems, created].toSorted((a, b) => a.sequence - b.sequence);
        syncLocalItems(nextItems);
        setExpandedItemId(created.id);
        setBanner({ tone: "success", text: "Song added to plan." });
      }

      setReplaceSongItemId(null);
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
    setBanner(null);

    try {
      await deleteJson<{ success: boolean }>(`/api/plan-items/${itemId}`, {
        service_type_id: serviceTypeId,
        plan_id: planId,
      });
      const nextItems = localItems
        .filter((item) => item.id !== itemId)
        .map((item, index) => ({ ...item, sequence: index + 1 }));
      syncLocalItems(nextItems);
      if (expandedItemId === itemId) {
        setExpandedItemId(null);
      }
      setBanner({ tone: "success", text: "Item removed." });
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
    setBanner(null);

    try {
      await postJson<{ success: boolean }>("/api/plan-items/reorder", {
        service_type_id: serviceTypeId,
        plan_id: planId,
        sequence: nextItems.map((item) => item.id),
      });
      setBanner({ tone: "success", text: "Plan order saved." });
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

  const handleMove = async (itemId: string, direction: -1 | 1) => {
    const currentIndex = localItems.findIndex((item) => item.id === itemId);
    if (currentIndex === -1) return;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= localItems.length) return;

    await persistReorder(moveItem(localItems, currentIndex, targetIndex));
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
    setReplaceSongItemId(null);
    setSongPickerOpen(true);
  };

  return (
    <>
      <SongPickerDialog
        open={songPickerOpen}
        onOpenChange={(open) => {
          setSongPickerOpen(open);
          if (!open) {
            setReplaceSongItemId(null);
          }
        }}
        serviceTypeId={serviceTypeId}
        onSelectSong={handleSongSelect}
        pendingSongId={pendingSongId}
      />

      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={openAddSong}>
            <Music4 className="size-4" />
            Add Song
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleCreateBasicItem("header")}
            disabled={pendingItemId === "create-header"}
          >
            <Type className="size-4" />
            Add Header
          </Button>
          <Button
            type="button"
            variant="outline"
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

        {banner ? (
          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-sm",
              banner.tone === "error"
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
            )}
          >
            {banner.text}
          </div>
        ) : null}

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
            <div className="space-y-3 pb-3">
              {localItems.map((item, index) => (
                <div
                  key={item.id}
                  draggable={pendingItemId !== "reorder"}
                  onDragStart={(event) => handleDragStart(event, item.id)}
                  onDragEnd={() => setDraggedItemId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, item.id)}
                >
                  <PlanItemCard
                    item={item}
                    serviceTypeId={serviceTypeId}
                    planId={planId}
                    isExpanded={expandedItemId === item.id}
                    isBusy={pendingItemId === item.id}
                    isDragged={draggedItemId === item.id}
                    canMoveUp={index > 0}
                    canMoveDown={index < localItems.length - 1}
                    onToggle={() =>
                      setExpandedItemId((current) => (current === item.id ? null : item.id))
                    }
                    onSave={(updatedItem) => {
                      const nextItems = localItems.map((current) =>
                        current.id === updatedItem.id ? updatedItem : current
                      );
                      syncLocalItems(nextItems);
                      startTransition(() => {
                        invalidatePlanItems();
                      });
                    }}
                    onDelete={() => handleDelete(item.id)}
                    onMoveUp={() => handleMove(item.id, -1)}
                    onMoveDown={() => handleMove(item.id, 1)}
                    onReplaceSong={() => {
                      setReplaceSongItemId(item.id);
                      setSongPickerOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}

interface PlanItemCardProps {
  item: PlanItem;
  serviceTypeId: string | null;
  planId: string | null;
  isExpanded: boolean;
  isBusy: boolean;
  isDragged: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onToggle: () => void;
  onSave: (item: PlanItem) => void;
  onDelete: () => Promise<void> | void;
  onMoveUp: () => Promise<void> | void;
  onMoveDown: () => Promise<void> | void;
  onReplaceSong: () => void;
}

function PlanItemCard({
  item,
  serviceTypeId,
  planId,
  isExpanded,
  isBusy,
  isDragged,
  canMoveUp,
  canMoveDown,
  onToggle,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
  onReplaceSong,
}: PlanItemCardProps) {
  const [draft, setDraft] = useState<DraftState>(() => buildDraft(item));
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { data: songOptions, isLoading: songOptionsLoading } = useSongOptions(
    isExpanded && item.song ? item.song.id : null,
    serviceTypeId
  );

  useEffect(() => {
    setDraft(buildDraft(item));
  }, [item]);

  const arrangements = useMemo(() => songOptions?.arrangements ?? [], [songOptions?.arrangements]);
  const selectedArrangement = useMemo(
    () => arrangements.find((arrangement) => arrangement.id === draft.arrangementId) ?? null,
    [arrangements, draft.arrangementId]
  );
  const keyOptions = selectedArrangement?.keys ?? [];

  useEffect(() => {
    if (!songOptions || arrangements.length === 0) return;

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
  }, [arrangements, songOptions]);

  const handleSubmit = async () => {
    if (!serviceTypeId || !planId) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await patchJson<PlanItem>(`/api/plan-items/${item.id}`, {
        service_type_id: serviceTypeId,
        plan_id: planId,
        title: draft.title,
        service_position: draft.servicePosition,
        length: draft.length.trim() ? Number(draft.length) : null,
        description: draft.description,
        html_details: draft.htmlDetails,
        song_id: undefined,
        arrangement_id: draft.arrangementId || undefined,
        key_id: draft.keyId || undefined,
        custom_arrangement_sequence: draft.customArrangementSequenceText
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      });

      onSave(updated);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save this item.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden border py-0 transition-shadow",
        isExpanded && "shadow-md",
        isDragged && "border-primary/40 opacity-70"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="text-muted-foreground cursor-grab">
          <GripVertical className="size-4" />
        </div>
        <Badge variant="secondary" className="tabular-nums">
          {item.sequence}
        </Badge>
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold">{item.title || "Untitled item"}</p>
              <Badge variant="outline">{summarizeType(item)}</Badge>
              {formatLength(item.length) ? (
                <Badge variant="outline">{formatLength(item.length)}</Badge>
              ) : null}
            </div>
            <div className="text-muted-foreground mt-1 flex flex-wrap gap-2 text-xs">
              {item.song ? <span>{item.song.title}</span> : null}
              {item.arrangement ? <span>{item.arrangement.name}</span> : null}
              {item.key ? <span>{item.key.name}</span> : null}
              {item.layout ? (
                <span className="inline-flex items-center gap-1">
                  <LayoutTemplate className="size-3.5" />
                  {item.layout.name}
                </span>
              ) : null}
            </div>
          </div>
          <ChevronDown className={cn("size-4 transition-transform", isExpanded && "rotate-180")} />
        </button>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={onMoveUp} disabled={!canMoveUp || isBusy}>
            <ArrowUp className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onMoveDown} disabled={!canMoveDown || isBusy}>
            <ArrowDown className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onDelete} disabled={isBusy}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {isExpanded ? (
        <div className="border-t px-4 py-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Title">
              <Input
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              />
            </Field>

            <Field label="Length (seconds)">
              <Input
                type="number"
                min={0}
                value={draft.length}
                onChange={(event) => setDraft((current) => ({ ...current, length: event.target.value }))}
              />
            </Field>

            <Field label="Service Position">
              <select
                className={cn(textareaClassName, "min-h-9 py-0")}
                value={draft.servicePosition}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, servicePosition: event.target.value }))
                }
              >
                <option value="pre">Pre-service</option>
                <option value="during">During service</option>
                <option value="post">Post-service</option>
              </select>
            </Field>

            {item.song ? (
              <Field label="Song">
                <div className="flex items-center gap-2">
                  <Input value={item.song.title} disabled />
                  <Button type="button" variant="outline" onClick={onReplaceSong}>
                    Replace
                  </Button>
                </div>
              </Field>
            ) : (
              <div />
            )}

            {item.song ? (
              <Field label="Arrangement">
                {songOptionsLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <select
                    className={cn(textareaClassName, "min-h-9 py-0")}
                    value={draft.arrangementId}
                    onChange={(event) => {
                      const nextArrangement = arrangements.find(
                        (arrangement) => arrangement.id === event.target.value
                      );
                      setDraft((current) => ({
                        ...current,
                        arrangementId: event.target.value,
                        keyId: nextArrangement?.keys[0]?.id ?? "",
                      }));
                    }}
                  >
                    <option value="">No arrangement</option>
                    {arrangements.map((arrangement: ArrangementOption) => (
                      <option key={arrangement.id} value={arrangement.id}>
                        {arrangement.name}
                        {arrangement.archived ? " (archived)" : ""}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            ) : null}

            {item.song ? (
              <Field label="Key">
                {songOptionsLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <select
                    className={cn(textareaClassName, "min-h-9 py-0")}
                    value={draft.keyId}
                    onChange={(event) => setDraft((current) => ({ ...current, keyId: event.target.value }))}
                    disabled={!selectedArrangement || keyOptions.length === 0}
                  >
                    <option value="">No key</option>
                    {keyOptions.map((key) => (
                      <option key={key.id} value={key.id}>
                        {key.name}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            ) : null}

            {item.song ? (
              <Field label="Layout">
                {songOptions?.layoutMode === "existing-only" && item.layout ? (
                  <div className="text-muted-foreground rounded-md border px-3 py-2 text-sm">
                    {item.layout.name} (read-only)
                  </div>
                ) : (
                  <div className="text-muted-foreground rounded-md border border-dashed px-3 py-2 text-sm">
                    Layout selection is not available from the documented API surface yet.
                  </div>
                )}
              </Field>
            ) : null}

            {item.song ? (
              <Field label="Arrangement Sequence">
                <Input
                  value={draft.customArrangementSequenceText}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      customArrangementSequenceText: event.target.value,
                    }))
                  }
                  placeholder="Verse 1, Chorus 1, Verse 2"
                />
              </Field>
            ) : null}

            <Field label="Description" className="lg:col-span-2">
              <textarea
                className={textareaClassName}
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, description: event.target.value }))
                }
              />
            </Field>

            <Field label="Details (HTML)" className="lg:col-span-2">
              <textarea
                className={textareaClassName}
                value={draft.htmlDetails}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, htmlDetails: event.target.value }))
                }
              />
            </Field>
          </div>

          {saveError ? (
            <p className="text-destructive mt-3 text-sm">{saveError}</p>
          ) : null}

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onToggle}>
              Close
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isSaving || isBusy}>
              {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
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
