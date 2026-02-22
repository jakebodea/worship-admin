import type {
  RawPlanPerson,
  ScheduleFrequency,
  ServiceHistoryItem,
} from "@/lib/types";

export interface SelectedPlanMatchContext {
  planId?: string;
  teamId?: string;
  selectedPositionName?: string;
  selectedTeamName?: string;
}

export interface HistoryBuildResult {
  serviceHistory: ServiceHistoryItem[];
  frequency: ScheduleFrequency;
  matchedPlanPerson?: RawPlanPerson;
}

