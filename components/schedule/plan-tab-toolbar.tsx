"use client";

import { LoaderCircle, Music4, Plus, Type } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanTabToolbarProps {
  pendingItemId: string | null;
  onAddSong: () => void;
  onAddHeader: () => void;
  onAddItem: () => void;
}

export function PlanTabToolbar({
  pendingItemId,
  onAddSong,
  onAddHeader,
  onAddItem,
}: PlanTabToolbarProps) {
  const reordering = pendingItemId === "reorder";

  return (
    <div className="sticky top-0 z-20 -mx-4 flex shrink-0 items-center gap-1 border-b border-border/50 bg-background/95 px-4 py-2 backdrop-blur sm:-mx-0 sm:rounded-md sm:border sm:bg-background">
      <Button type="button" variant="ghost" size="sm" className="h-8 gap-1.5" onClick={onAddSong}>
        <Music4 className="size-4 opacity-70" />
        Song
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5"
        onClick={onAddHeader}
        disabled={pendingItemId === "create-header"}
      >
        <Type className="size-4 opacity-70" />
        Header
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5"
        onClick={onAddItem}
        disabled={pendingItemId === "create-item"}
      >
        <Plus className="size-4 opacity-70" />
        Item
      </Button>
      {reordering ? (
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <LoaderCircle className="size-3.5 animate-spin" />
          Saving order…
        </span>
      ) : null}
    </div>
  );
}
