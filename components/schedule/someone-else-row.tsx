"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarPlus, Loader2, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePeopleSearch, type PeopleSearchResult } from "@/hooks/use-people-search";
import { useSchedulePlanPerson } from "@/hooks/use-schedule-plan-person";

interface SomeoneElseRowProps {
  serviceTypeId?: string | null;
  planId?: string | null;
  teamId?: string | null;
  positionId?: string | null;
  onScheduleSuccess?: () => void;
  onScheduleError?: (message: string) => void;
}

export function SomeoneElseRow({
  serviceTypeId,
  planId,
  teamId,
  positionId,
  onScheduleSuccess,
  onScheduleError,
}: SomeoneElseRowProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const search = usePeopleSearch(debouncedQuery);
  const canSchedule = !!serviceTypeId && !!planId && !!teamId && !!positionId;

  const handleSuccess = () => {
    setOpen(false);
    setQuery("");
    setDebouncedQuery("");
    onScheduleSuccess?.();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/30"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground sm:size-9">
            <UserPlus className="size-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground sm:text-base">
            Someone else...
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        collisionPadding={16}
        className="w-[min(24rem,calc(100vw-2rem))] p-2"
      >
        <SomeoneElseSearchContent
          inputRef={inputRef}
          query={query}
          onQueryChange={setQuery}
          showPrompt={query.trim().length < 2}
          showLoading={query.trim().length >= 2 && search.isFetching}
          isError={search.isError}
          results={search.data ?? []}
          serviceTypeId={serviceTypeId}
          planId={planId}
          teamId={teamId}
          positionId={positionId}
          canSchedule={canSchedule}
          onScheduleSuccess={handleSuccess}
          onScheduleError={onScheduleError}
        />
      </PopoverContent>
    </Popover>
  );
}

function SomeoneElseSearchContent({
  inputRef,
  query,
  onQueryChange,
  showPrompt,
  showLoading,
  isError,
  results,
  serviceTypeId,
  planId,
  teamId,
  positionId,
  canSchedule,
  onScheduleSuccess,
  onScheduleError,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  onQueryChange: (query: string) => void;
  showPrompt: boolean;
  showLoading: boolean;
  isError: boolean;
  results: PeopleSearchResult[];
  serviceTypeId?: string | null;
  planId?: string | null;
  teamId?: string | null;
  positionId?: string | null;
  canSchedule: boolean;
  onScheduleSuccess?: () => void;
  onScheduleError?: (message: string) => void;
}) {
  return (
    <Command shouldFilter={false}>
      <CommandInput
        ref={inputRef}
        value={query}
        onValueChange={onQueryChange}
        placeholder="Search people"
      />
      <CommandList className="max-h-72">
        {showPrompt ? (
          <p className="px-3 py-2.5 text-sm text-muted-foreground">Type at least 2 characters.</p>
        ) : showLoading ? (
          <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Searching
          </div>
        ) : isError ? (
          <p className="px-3 py-2.5 text-sm text-destructive">Search failed.</p>
        ) : results.length === 0 ? (
          <CommandEmpty>No people found.</CommandEmpty>
        ) : (
          <CommandGroup>
            {results.map((person) => (
              <SomeoneElseResultRow
                key={person.id}
                person={person}
                serviceTypeId={serviceTypeId}
                planId={planId}
                teamId={teamId}
                positionId={positionId}
                canSchedule={canSchedule}
                onScheduleSuccess={onScheduleSuccess}
                onScheduleError={onScheduleError}
              />
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}

function SomeoneElseResultRow({
  person,
  serviceTypeId,
  planId,
  teamId,
  positionId,
  canSchedule,
  onScheduleSuccess,
  onScheduleError,
}: {
  person: PeopleSearchResult;
  serviceTypeId?: string | null;
  planId?: string | null;
  teamId?: string | null;
  positionId?: string | null;
  canSchedule: boolean;
  onScheduleSuccess?: () => void;
  onScheduleError?: (message: string) => void;
}) {
  const { isScheduling, handleSchedule } = useSchedulePlanPerson({
    serviceTypeId,
    planId,
    teamId,
    positionId,
    canSchedule,
    onScheduleSuccess,
    onScheduleError,
    oneOff: true,
  });
  const initials = `${person.firstName[0] ?? ""}${person.lastName[0] ?? ""}` || "?";

  return (
    <CommandItem
      value={`${person.fullName} ${person.id}`}
      onSelect={() => void handleSchedule(person.id)}
      disabled={!canSchedule || isScheduling}
      className="py-2"
    >
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={person.photoThumbnailUrl ?? undefined} alt={person.fullName} />
        <AvatarFallback className="bg-muted text-xs font-medium">{initials}</AvatarFallback>
      </Avatar>
      <p className="min-w-0 flex-1 truncate text-sm font-medium">{person.fullName}</p>
      {isScheduling ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : (
        <CalendarPlus className="size-3.5 opacity-70" aria-hidden />
      )}
    </CommandItem>
  );
}
