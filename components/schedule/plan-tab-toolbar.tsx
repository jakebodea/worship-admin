"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { GripVertical, LoaderCircle, Music4, Plus, Type } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [toolbarPosition, setToolbarPosition] = useState({ right: 24, bottom: 24 });
  const toolbarDragRef = useRef<ToolbarDragState | null>(null);

  const handleToolbarPointerMove = useEffectEvent((event: globalThis.PointerEvent) => {
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
  });

  const handleToolbarPointerEnd = useEffectEvent((event: globalThis.PointerEvent) => {
    if (!toolbarDragRef.current) return;
    if (event.pointerId !== toolbarDragRef.current.pointerId) return;
    toolbarDragRef.current = null;
  });

  useEffect(() => {
    window.addEventListener("pointermove", handleToolbarPointerMove);
    window.addEventListener("pointerup", handleToolbarPointerEnd);
    window.addEventListener("pointercancel", handleToolbarPointerEnd);

    return () => {
      window.removeEventListener("pointermove", handleToolbarPointerMove);
      window.removeEventListener("pointerup", handleToolbarPointerEnd);
      window.removeEventListener("pointercancel", handleToolbarPointerEnd);
    };
  }, []);

  const handleToolbarDragStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toolbarDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRight: toolbarPosition.right,
      startBottom: toolbarPosition.bottom,
    };
  };

  return (
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
      <Button type="button" variant="ghost" onClick={onAddSong}>
        <Music4 className="size-4" />
        Add Song
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onAddHeader}
        disabled={pendingItemId === "create-header"}
      >
        <Type className="size-4" />
        Add Header
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onAddItem}
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
  );
}
