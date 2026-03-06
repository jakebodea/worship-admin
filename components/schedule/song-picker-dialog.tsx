"use client";

import { useDeferredValue, useState } from "react";
import { Music4, Search } from "lucide-react";
import { useSongSearch } from "@/hooks/use-song-search";
import type { SongCatalogEntry } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface SongPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceTypeId: string | null;
  onSelectSong: (song: SongCatalogEntry) => Promise<void> | void;
  pendingSongId?: string | null;
}

function formatLastScheduled(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function SongPickerDialog({
  open,
  onOpenChange,
  serviceTypeId,
  onSelectSong,
  pendingSongId = null,
}: SongPickerDialogProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const { data: songs = [], isLoading, isFetching } = useSongSearch(serviceTypeId, deferredQuery);
  const showResults = deferredQuery.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Song</DialogTitle>
          <DialogDescription>
            Search the Planning Center song catalog and insert a song into this plan.
          </DialogDescription>
        </DialogHeader>

        <Command shouldFilter={false} className="rounded-lg border">
          <CommandInput
            placeholder="Search songs, writers, or themes..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[420px]">
            {!showResults ? (
              <div className="text-muted-foreground flex min-h-[240px] flex-col items-center justify-center gap-2 px-6 py-10 text-center text-sm">
                <Search className="size-8 opacity-50" />
                <p>Start typing to search the song catalog.</p>
              </div>
            ) : isLoading || isFetching ? (
                <div className="space-y-2 p-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
            ) : (
              <>
                <CommandEmpty>No songs matched that search.</CommandEmpty>
                <div className="space-y-2 p-3">
                  {songs.map((song) => (
                    <Button
                      key={song.id}
                      type="button"
                      variant="ghost"
                      className="h-auto w-full justify-start rounded-lg border px-4 py-3 text-left"
                      disabled={pendingSongId === song.id}
                      onClick={async () => {
                        await onSelectSong(song);
                      }}
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="bg-muted text-muted-foreground mt-0.5 rounded-md p-2">
                          <Music4 className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-semibold">{song.title}</p>
                            {song.matchScore ? (
                              <Badge variant="secondary" className="text-[10px]">
                                match
                              </Badge>
                            ) : null}
                          </div>
                          {song.author ? (
                            <p className="text-muted-foreground truncate text-xs">{song.author}</p>
                          ) : null}
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            {song.themes
                              .split(",")
                              .map((theme) => theme.trim())
                              .filter(Boolean)
                              .slice(0, 3)
                              .map((theme) => (
                                <Badge key={theme} variant="outline">
                                  {theme}
                                </Badge>
                              ))}
                            {formatLastScheduled(song.lastScheduledAt) ? (
                              <span className="text-muted-foreground">
                                Last scheduled {formatLastScheduled(song.lastScheduledAt)}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
