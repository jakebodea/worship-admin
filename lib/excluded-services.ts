/**
 * Globally excluded service type IDs configured via env.
 * Set PLANNING_CENTER_EXCLUDED_SERVICE_IDS to a comma-separated list.
 * These service types will be filtered out from:
 * - Service types list
 * - Person service history records
 * - Schedule history records
 */
const rawExcludedServiceIds = process.env.PLANNING_CENTER_EXCLUDED_SERVICE_IDS ?? "";
export const EXCLUDED_SERVICE_IDS: string[] = [
  ...new Set(
    rawExcludedServiceIds
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  ),
];

/**
 * Check if a service type ID should be excluded
 */
export function isServiceExcluded(serviceId: string): boolean {
  return EXCLUDED_SERVICE_IDS.includes(serviceId);
}
