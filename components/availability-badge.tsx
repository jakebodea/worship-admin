import { Badge } from "@/components/ui/badge";
import type { AvailabilityStatus, Blockout } from "@/lib/types";

interface AvailabilityBadgeProps {
  blockouts: Blockout[];
  checkDate?: Date;
}

export function AvailabilityBadge({
  blockouts,
  checkDate = new Date(),
}: AvailabilityBadgeProps) {
  const status = getAvailabilityStatus(blockouts, checkDate);

  const variants = {
    available: "default",
    blocked: "destructive",
    unknown: "secondary",
  } as const;

  const labels = {
    available: "Available",
    blocked: "Blocked Out",
    unknown: "Unknown",
  };

  return (
    <Badge variant={variants[status]} className="text-xs">
      {labels[status]}
    </Badge>
  );
}

function getAvailabilityStatus(
  blockouts: Blockout[],
  checkDate: Date
): AvailabilityStatus {
  if (!blockouts || blockouts.length === 0) {
    return "available";
  }

  const isBlocked = blockouts.some((blockout) => {
    const start = new Date(blockout.startsAt);
    const end = new Date(blockout.endsAt);
    return checkDate >= start && checkDate <= end;
  });

  return isBlocked ? "blocked" : "available";
}
