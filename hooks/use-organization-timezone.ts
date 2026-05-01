"use client";

import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/http/client";
import { queryKeys } from "@/lib/query-keys";

/** Client hook for the Services org `time_zone` (via `/api/planning-center/organization`). */
export function useOrganizationTimeZone(): string {
  const { data } = useQuery({
    queryKey: queryKeys.organizationTimeZone(),
    queryFn: () => getJson<{ timeZone: string }>("/api/planning-center/organization"),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });

  const tz = data?.timeZone?.trim();
  if (tz) return tz;

  return (
    process.env.NEXT_PUBLIC_PLANNING_CENTER_TIME_ZONE?.trim() ||
    "America/Los_Angeles"
  );
}
