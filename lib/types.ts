// Planning Center API Response Types

export interface PCApiResponse<T> {
  data: T;
  included?: PCResource[];
  meta?: {
    total_count?: number;
    count?: number;
    next?: { offset: number };
    prev?: { offset: number };
  };
  links?: {
    self?: string;
    next?: string;
    prev?: string;
  };
}

export interface PCResource {
  type: string;
  id: string;
  attributes: Record<string, unknown>;
  relationships?: Record<string, PCRelationship>;
}

export interface PCRelationship {
  data?: PCResourceIdentifier | PCResourceIdentifier[];
  links?: {
    related?: string;
  };
}

export interface PCResourceIdentifier {
  type: string;
  id: string;
}

// Person Types
export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  photoUrl: string | null;
  photoThumbnailUrl: string | null;
  archived: boolean;
  positions: TeamPosition[];
}

export interface RawPerson {
  type: "Person";
  id: string;
  attributes: {
    first_name: string;
    last_name: string;
    photo_url: string | null;
    photo_thumbnail_url: string | null;
    archived_at: string | null;
  };
  relationships?: {
    team_positions?: PCRelationship;
  };
}

// Team Types
export interface Team {
  id: string;
  name: string;
  sequence: number;
  rehearsalTeam: boolean;
}

export interface RawTeam {
  type: "Team";
  id: string;
  attributes: {
    name: string;
    sequence: number;
    rehearsal_team: boolean;
    archived_at: string | null;
  };
}

// Team Position Types
export interface TeamPosition {
  id: string;
  name: string;
  teamId: string;
  teamName?: string;
}

export interface RawTeamPosition {
  type: "TeamPosition";
  id: string;
  attributes: {
    name: string;
  };
  relationships?: {
    team?: {
      data: PCResourceIdentifier;
    };
  };
}

// Blockout Types
export interface Blockout {
  id: string;
  reason: string;
  startsAt: Date;
  endsAt: Date;
  description: string;
  share: boolean;
}

export interface RawBlockout {
  type: "Blockout";
  id: string;
  attributes: {
    reason: string;
    starts_at: string;
    ends_at: string;
    description: string;
    share: boolean;
  };
}

// PlanPerson Types (Scheduling History)
export interface PlanPerson {
  id: string;
  status: string;
  createdAt: Date;
  teamPositionName: string;
  planTitle?: string;
  planDate?: Date;
  declineReason?: string;
}

export interface RawPlanPerson {
  type: "PlanPerson";
  id: string;
  attributes: {
    status: string;
    created_at: string;
    team_position_name: string;
    decline_reason?: string;
  };
  relationships?: {
    plan?: {
      data: PCResourceIdentifier;
    };
  };
}

// Service Type Types
export interface ServiceType {
  id: string;
  name: string;
  sequence: number;
}

export interface RawServiceType {
  type: "ServiceType";
  id: string;
  attributes: {
    name: string;
    sequence: number;
  };
}

// Plan Types
export interface Plan {
  id: string;
  title: string;
  seriesTitle?: string;
  createdAt: Date;
  sortDate?: Date;
}

export interface RawPlan {
  type: "Plan";
  id: string;
  attributes: {
    title: string;
    series_title?: string;
    created_at: string;
    sort_date?: string;
  };
  relationships?: {
    service_type?: {
      data: PCResourceIdentifier;
    };
  };
}

// Service History Item Types
export interface ServiceHistoryItem {
  id: string;
  date: Date;
  teamPositionName: string;
  teamName?: string;
  serviceTypeName?: string;
  planTitle?: string;
  status: string;
}

// Team Position Group Types
export interface TeamPositionGroup {
  teamId: string;
  teamName: string;
  positions: TeamPosition[];
}

// Utility type for frequency tracking
export interface ScheduleFrequency {
  last30Days: number;
  last60Days: number;
  last90Days: number;
  lastServedDate?: Date;
  totalServed: number;
}

// UI Helper Types
export type AvailabilityStatus = "available" | "blocked" | "unknown";
export type FrequencyLevel = "low" | "medium" | "high";

export interface PersonWithAvailability extends Person {
  availability?: AvailabilityStatus;
  frequency?: ScheduleFrequency;
  blockouts?: Blockout[];
  serviceHistory?: ServiceHistoryItem[];
  isBlockedForDate?: boolean;
  recommendationScore?: number;
}
