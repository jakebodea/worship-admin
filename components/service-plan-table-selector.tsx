"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { ServiceTypeMultiSelect } from "@/components/service-type-multi-select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMyScheduledPlans } from "@/hooks/use-my-scheduled-plans";
import { useServiceTypes } from "@/hooks/use-service-types";
import { createTeamPositionsQueryOptions } from "@/hooks/use-team-positions";
import { getJson } from "@/lib/http/client";
import { queryKeys } from "@/lib/query-keys";
import type { Plan } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ServicePlanTableSelectorProps {
  selectedServiceTypeId: string | null;
  selectedPlanId: string | null;
  onSelect: (selection: { serviceTypeId: string; planId: string }) => void;
}

type DateRangeFilter = "all" | "14" | "30" | "60";
const SERVICE_TYPE_FILTER_STORAGE_KEY = "schedule:selected-service-type-ids";
const TEAM_POSITIONS_PREFETCH_DELAY_MS = 300;

interface ServicePlanRow {
  serviceTypeId: string;
  serviceTypeName: string;
  serviceTypeSequence: number;
  planId: string;
  planTitle: string;
  seriesTitle: string | null;
  seriesId: string | null;
  sortDate: Date;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function parsePlanDate(value: Date | string | undefined): Date | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isInDateWindow(date: Date, range: DateRangeFilter): boolean {
  if (range === "all") return true;

  const days = Number(range);
  if (!Number.isFinite(days)) return true;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const max = new Date(now);
  max.setDate(max.getDate() + days);

  return date >= now && date <= max;
}

function readStoredServiceTypeIds(): string[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SERVICE_TYPE_FILTER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    const ids = parsed.filter((value): value is string => typeof value === "string");
    return ids;
  } catch {
    return null;
  }
}

export function ServicePlanTableSelector({
  selectedServiceTypeId,
  selectedPlanId,
  onSelect,
}: ServicePlanTableSelectorProps) {
  const queryClient = useQueryClient();
  const prefetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: serviceTypes, isLoading: serviceTypesLoading } = useServiceTypes();

  const planQueries = useQueries({
    queries: (serviceTypes ?? []).map((serviceType) => ({
      queryKey: queryKeys.plans(serviceType.id),
      queryFn: () => getJson<Plan[]>(`/api/plans?service_type_id=${serviceType.id}`),
      staleTime: 5 * 60 * 1000,
      enabled: !!serviceTypes,
    })),
  });

  const [searchValue, setSearchValue] = useState("");
  const [selectedServiceTypeIds, setSelectedServiceTypeIds] = useState<string[] | null>(
    () => (selectedServiceTypeId ? [selectedServiceTypeId] : readStoredServiceTypeIds())
  );
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>("60");

  const allServiceTypeIds = useMemo(
    () => (serviceTypes ?? []).map((serviceType) => serviceType.id),
    [serviceTypes]
  );
  const validServiceTypeIdSet = useMemo(
    () => new Set(allServiceTypeIds),
    [allServiceTypeIds]
  );
  const effectiveSelectedServiceTypeIds = useMemo(() => {
    if (selectedServiceTypeId) {
      return validServiceTypeIdSet.has(selectedServiceTypeId)
        ? [selectedServiceTypeId]
        : [];
    }

    if (selectedServiceTypeIds === null) {
      return allServiceTypeIds;
    }

    return selectedServiceTypeIds.filter((id) => validServiceTypeIdSet.has(id));
  }, [
    allServiceTypeIds,
    selectedServiceTypeId,
    selectedServiceTypeIds,
    validServiceTypeIdSet,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedServiceTypeIds === null) return;

    try {
      window.localStorage.setItem(
        SERVICE_TYPE_FILTER_STORAGE_KEY,
        JSON.stringify(selectedServiceTypeIds)
      );
    } catch {
      // Ignore storage write failures (private mode/quota).
    }
  }, [selectedServiceTypeIds]);

  const selectedServiceTypeIdSet = useMemo(
    () => new Set(effectiveSelectedServiceTypeIds),
    [effectiveSelectedServiceTypeIds]
  );

  const rows = useMemo(() => {
    if (!serviceTypes) return [];

    const flattened: ServicePlanRow[] = [];

    for (const [index, serviceType] of serviceTypes.entries()) {
      const plans = planQueries[index]?.data ?? [];
      for (const plan of plans) {
        const sortDate = parsePlanDate(plan.sortDate);
        if (!sortDate) continue;

        flattened.push({
          serviceTypeId: serviceType.id,
          serviceTypeName: serviceType.name,
          serviceTypeSequence: serviceType.sequence,
          planId: plan.id,
          planTitle: plan.title,
          seriesTitle: plan.seriesTitle ?? null,
          seriesId: plan.seriesId ?? null,
          sortDate,
        });
      }
    }

    return flattened.toSorted((a, b) => {
      const byDate = a.sortDate.getTime() - b.sortDate.getTime();
      if (byDate !== 0) return byDate;

      const byServiceOrder = a.serviceTypeSequence - b.serviceTypeSequence;
      if (byServiceOrder !== 0) return byServiceOrder;

      const byServiceName = a.serviceTypeName.localeCompare(b.serviceTypeName);
      if (byServiceName !== 0) return byServiceName;

      return a.planTitle.localeCompare(b.planTitle);
    });
  }, [planQueries, serviceTypes]);

  const visibleRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return rows.filter((row) => {
      if (selectedServiceTypeIdSet.size === 0) return false;
      if (!selectedServiceTypeIdSet.has(row.serviceTypeId)) {
        return false;
      }

      if (!isInDateWindow(row.sortDate, dateRangeFilter)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        row.serviceTypeName,
        row.planTitle,
        row.seriesTitle ?? "",
        formatDate(row.sortDate),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [dateRangeFilter, rows, searchValue, selectedServiceTypeIdSet]);

  const plansLoading = planQueries.some((query) => query.isLoading);
  const isLoading = serviceTypesLoading || plansLoading;
  const errorMessage = planQueries.find((query) => query.isError)?.error;
  const planIdsForLookup = useMemo(
    () => [...new Set(rows.map((row) => row.planId))],
    [rows]
  );
  const { data: myScheduledPlans } = useMyScheduledPlans(planIdsForLookup);
  const myScheduledPlanIdSet = useMemo(
    () => new Set(myScheduledPlans?.planIds ?? []),
    [myScheduledPlans?.planIds]
  );
  const prefetchTeamPositions = useCallback(
    (row: ServicePlanRow) => {
      void queryClient.prefetchQuery(
        createTeamPositionsQueryOptions(row.serviceTypeId, row.planId, row.seriesId)
      );
    },
    [queryClient]
  );
  const cancelDelayedPrefetch = useCallback(() => {
    if (!prefetchTimeoutRef.current) return;
    clearTimeout(prefetchTimeoutRef.current);
    prefetchTimeoutRef.current = null;
  }, []);
  const scheduleDelayedPrefetch = useCallback(
    (row: ServicePlanRow) => {
      cancelDelayedPrefetch();
      prefetchTimeoutRef.current = setTimeout(() => {
        prefetchTimeoutRef.current = null;
        prefetchTeamPositions(row);
      }, TEAM_POSITIONS_PREFETCH_DELAY_MS);
    },
    [cancelDelayedPrefetch, prefetchTeamPositions]
  );

  useEffect(() => cancelDelayedPrefetch, [cancelDelayedPrefetch]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_200px]">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search service type, plan title, series, or date"
            className="pl-9"
            aria-label="Search services and plans"
          />
        </div>

        <ServiceTypeMultiSelect
          options={serviceTypes ?? []}
          selectedIds={effectiveSelectedServiceTypeIds}
          onChange={setSelectedServiceTypeIds}
        />

        <Select value={dateRangeFilter} onValueChange={(value) => setDateRangeFilter(value as DateRangeFilter)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All loaded dates</SelectItem>
            <SelectItem value="14">Next 14 days</SelectItem>
            <SelectItem value="30">Next 30 days</SelectItem>
            <SelectItem value="60">Next 60 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-muted">
              <TableHead className="w-[30%] px-4">Service Type</TableHead>
              <TableHead className="w-[20%] px-4">Date</TableHead>
              <TableHead className="w-[25%] px-4">Series</TableHead>
              <TableHead className="px-4">Plan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell className="px-4">
                    <div className="bg-muted h-4 w-40 animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="px-4">
                    <div className="bg-muted h-4 w-28 animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="px-4">
                    <div className="bg-muted h-4 w-36 animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="px-4">
                    <div className="bg-muted h-4 w-48 animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : errorMessage ? (
              <TableRow>
                <TableCell className="px-4 py-8 text-center text-sm text-muted-foreground" colSpan={4}>
                  Failed to load plans. Refresh and try again.
                </TableCell>
              </TableRow>
            ) : visibleRows.length === 0 ? (
              <TableRow>
                <TableCell className="px-4 py-8 text-center text-sm text-muted-foreground" colSpan={4}>
                  No matching plans found.
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((row) => {
                const isActive = row.planId === selectedPlanId;
                const isScheduledForCurrentUser = myScheduledPlanIdSet.has(row.planId);

                return (
                  <TableRow
                    key={`${row.serviceTypeId}:${row.planId}`}
                    data-state={isActive ? "selected" : undefined}
                    className={cn(
                      "cursor-pointer",
                      isScheduledForCurrentUser &&
                        "bg-emerald-50/70 hover:bg-emerald-100/70 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/35"
                    )}
                    tabIndex={0}
                    aria-selected={isActive}
                    onClick={() =>
                      onSelect({
                        serviceTypeId: row.serviceTypeId,
                        planId: row.planId,
                      })
                    }
                    onMouseEnter={() => scheduleDelayedPrefetch(row)}
                    onMouseLeave={cancelDelayedPrefetch}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      onSelect({
                        serviceTypeId: row.serviceTypeId,
                        planId: row.planId,
                      });
                    }}
                  >
                    <TableCell className="px-4 font-medium">{row.serviceTypeName}</TableCell>
                    <TableCell className="px-4">{formatDate(row.sortDate)}</TableCell>
                    <TableCell className="px-4">
                      {row.seriesTitle ? (
                        <span className="truncate">{row.seriesTitle}</span>
                      ) : (
                        <Badge variant="secondary">No series</Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{row.planTitle || "Untitled plan"}</span>
                        {isScheduledForCurrentUser ? (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                          >
                            Scheduled
                          </Badge>
                        ) : null}
                        {isActive ? <Badge variant="secondary">Selected</Badge> : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
