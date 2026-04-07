export const queryKeys = {
  organizationTimeZone: () => ["planning-center-organization-time-zone"] as const,
  serviceTypes: () => ["service-types"] as const,
  plans: (serviceTypeId: string | null) => ["plans", serviceTypeId] as const,
  teamPositions: (
    serviceTypeId: string | null,
    planId: string | null,
    seriesId: string | null
  ) => ["team-positions", serviceTypeId, planId, seriesId] as const,
  people: (
    serviceTypeId: string | null,
    teamId: string | null,
    positionId: string | null,
    planId: string | null,
    dateKey: string | null
  ) => ["people", serviceTypeId, teamId, positionId, planId, dateKey] as const,
  peopleForSlot: (
    serviceTypeId: string | null,
    teamId: string | null,
    positionId: string | null,
    planId: string | null
  ) => ["people", serviceTypeId, teamId, positionId, planId] as const,
  blockouts: (personId: string | null) => ["blockouts", personId] as const,
  scheduleHistory: (personId: string | null, days: number) =>
    ["schedule-history", personId, days] as const,
  myScheduledPlans: (planIdsKey: string) =>
    ["my-scheduled-plans", planIdsKey] as const,
  planItems: (serviceTypeId: string | null, planId: string | null) =>
    ["plan-items", serviceTypeId, planId] as const,
  songSearch: (serviceTypeId: string | null, query: string) =>
    ["song-search", serviceTypeId, query] as const,
  songOptions: (songId: string | null, serviceTypeId: string | null) =>
    ["song-options", songId, serviceTypeId] as const,
} as const;
