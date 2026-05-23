"use client";

import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/http/client";
import { queryKeys } from "@/lib/query-keys";

export interface PeopleSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  photoThumbnailUrl: string | null;
}

export function usePeopleSearch(query: string) {
  const normalizedQuery = query.trim();

  return useQuery<PeopleSearchResult[]>({
    queryKey: queryKeys.peopleSearch(normalizedQuery),
    queryFn: () =>
      getJson<PeopleSearchResult[]>(
        `/api/people/search?q=${encodeURIComponent(normalizedQuery)}`
      ),
    enabled: normalizedQuery.length >= 2,
    staleTime: 30_000,
  });
}
