import type { ScheduleFrequency, FrequencyLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FrequencyIndicatorProps {
  frequency: ScheduleFrequency;
  className?: string;
}

export function FrequencyIndicator({
  frequency,
  className,
}: FrequencyIndicatorProps) {
  const level = getFrequencyLevel(frequency);
  
  const colors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };

  const labels = {
    low: "Good to schedule",
    medium: "Served recently",
    high: "Served frequently",
  };

  const textColors = {
    low: "text-green-700",
    medium: "text-yellow-700",
    high: "text-red-700",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("h-2 w-2 rounded-full", colors[level])} />
      <span className={cn("text-xs font-medium", textColors[level])}>
        {labels[level]}
      </span>
      <span className="text-xs text-muted-foreground">
        ({frequency.last30Days} in 30d)
      </span>
    </div>
  );
}

function getFrequencyLevel(frequency: ScheduleFrequency): FrequencyLevel {
  const { last30Days } = frequency;
  
  if (last30Days === 0) return "low";
  if (last30Days <= 2) return "medium";
  return "high";
}

export function FrequencyStats({ frequency }: { frequency: ScheduleFrequency }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-center text-xs">
      <div>
        <div className="font-semibold">{frequency.last30Days}</div>
        <div className="text-muted-foreground">30d</div>
      </div>
      <div>
        <div className="font-semibold">{frequency.last60Days}</div>
        <div className="text-muted-foreground">60d</div>
      </div>
      <div>
        <div className="font-semibold">{frequency.last90Days}</div>
        <div className="text-muted-foreground">90d</div>
      </div>
    </div>
  );
}
