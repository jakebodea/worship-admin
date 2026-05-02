"use client";

import { Check, Loader2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type PlanPersonStatusCode,
  useUpdatePlanPersonStatus,
} from "@/hooks/use-update-plan-person-status";
import { cn } from "@/lib/utils";

export type PlanPersonStatusValue = "confirmed" | "scheduled" | "declined";

const STATUS_TO_CODE: Record<PlanPersonStatusValue, PlanPersonStatusCode> = {
  confirmed: "C",
  scheduled: "U",
  declined: "D",
};

const ITEMS: { value: PlanPersonStatusValue; label: string; dotClassName: string }[] = [
  { value: "confirmed", label: "Confirmed", dotClassName: "bg-emerald-500" },
  { value: "scheduled", label: "Pending", dotClassName: "bg-amber-500" },
  { value: "declined", label: "Declined", dotClassName: "bg-red-500" },
];

export interface PlanPersonStatusMenuProps {
  planPersonId: string | null | undefined;
  currentStatus: PlanPersonStatusValue;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function PlanPersonStatusMenu({
  planPersonId,
  currentStatus,
  onSuccess,
  onError,
}: PlanPersonStatusMenuProps) {
  const { isUpdating, handleUpdate } = useUpdatePlanPersonStatus({ onSuccess, onError });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto size-8"
          aria-label="Change status"
          disabled={!planPersonId || isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <MoreVertical className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {ITEMS.map(({ value, label, dotClassName }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => void handleUpdate(planPersonId, STATUS_TO_CODE[value])}
          >
            <span className={cn("size-1.5 shrink-0 rounded-full", dotClassName)} aria-hidden />
            <span className="flex-1">{label}</span>
            {currentStatus === value ? (
              <Check className="size-3.5 opacity-70" aria-hidden />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
