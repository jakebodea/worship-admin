import { formatCalendarDayInTimeZone } from "@/lib/use-cases/planning-center/people/calendar-day";

export { formatCalendarDayInTimeZone };

/** Pure calendar helpers — supply IANA `timeZone` from Planning Center org resolution (server/client). */

function utcCivilMidnight(dayKey: string): number {
  const [y, m, d] = dayKey.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Add civil calendar days to a YYYY-MM-DD key; result formatted in `timeZone`. */
export function addCalendarDaysToDayKey(
  dayKey: string,
  deltaDays: number,
  timeZone: string
): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  const rolled = new Date(Date.UTC(y, m - 1, d + deltaDays, 12, 0, 0));
  return formatCalendarDayInTimeZone(rolled, timeZone);
}

/**
 * Calendar-day distance from `itemDayKey` to `refDayKey` (ref − item).
 * Positive when the reference day is after the item day.
 */
export function orgCalendarDaysRefMinusItem(itemDayKey: string, refDayKey: string): number {
  return Math.round(
    (utcCivilMidnight(refDayKey) - utcCivilMidnight(itemDayKey)) / 86_400_000
  );
}

/** Calendar days from instant `a` to instant `b` in org zone (b − a). */
export function orgCalendarDaysBetween(a: Date, b: Date, orgTimeZone: string): number {
  return orgCalendarDaysRefMinusItem(
    formatCalendarDayInTimeZone(a, orgTimeZone),
    formatCalendarDayInTimeZone(b, orgTimeZone)
  );
}
