/**
 * Calendar days on each side of the selected plan/reference date when loading plans and
 * `team_members` for history merge (`getPeopleForPosition`).
 *
 * `buildFrequencyFromServiceHistory` uses the same span for `ScheduleFrequency.recentServedDays` /
 * `recentRehearsalOnlyDays` so UI and scoring match
 * the data we actually load.
 */
export const PLAN_HISTORY_HALF_RANGE_DAYS = 21 as const;
