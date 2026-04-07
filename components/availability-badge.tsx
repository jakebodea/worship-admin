import { Badge } from "@/components/ui/badge";
import type { AvailabilityStatus, Blockout } from "@/lib/types";
import { blockoutCoversPlanSortInstant } from "@/lib/use-cases/planning-center/people/calendar-day";

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

  const isBlocked = blockouts.some((blockout) =>
    blockoutCoversPlanSortInstant(checkDate, {
      startsAt: new Date(blockout.startsAt),
      endsAt: new Date(blockout.endsAt),
      timeZone: blockout.timeZone,
    })
  );

  return isBlocked ? "blocked" : "available";
}
