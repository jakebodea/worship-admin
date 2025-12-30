/**
 * Globally excluded service type IDs.
 * These service types will be filtered out from:
 * - Service types list
 * - Person service history records
 * - Schedule history records
 */
export const EXCLUDED_SERVICE_IDS: string[] = [
  "1025407", // Junior Academy Worship Team
  "1106935", // Worship Leading Classes
  "1280704", // Children's Ministry
  "1039924", // Special Services & Meetings
];

/**
 * Check if a service type ID should be excluded
 */
export function isServiceExcluded(serviceId: string): boolean {
  return EXCLUDED_SERVICE_IDS.includes(serviceId);
}
