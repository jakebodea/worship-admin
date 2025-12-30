"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AvailabilityBadge } from "./availability-badge";
import { FrequencyIndicator, FrequencyStats } from "./frequency-indicator";
import { useBlockouts } from "@/hooks/use-blockouts";
import { useScheduleHistory } from "@/hooks/use-schedule-history";
import type { Person } from "@/lib/types";

interface PersonCardProps {
  person: Person;
  checkDate?: Date;
}

export function PersonCard({ person, checkDate }: PersonCardProps) {
  const { data: blockouts, isLoading: blockoutsLoading } = useBlockouts(
    person.id
  );
  const { data: history, isLoading: historyLoading } = useScheduleHistory(
    person.id,
    90
  );

  const initials = `${person.firstName[0]}${person.lastName[0]}`;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage
              src={person.photoThumbnailUrl || undefined}
              alt={person.fullName}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{person.fullName}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {person.positions.slice(0, 2).map((pos) => (
                <Badge key={pos.id} variant="outline" className="text-xs">
                  {pos.name}
                </Badge>
              ))}
              {person.positions.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{person.positions.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {blockoutsLoading ? (
          <Skeleton className="h-5 w-24" />
        ) : (
          <AvailabilityBadge
            blockouts={blockouts || []}
            checkDate={checkDate}
          />
        )}
        
        {historyLoading ? (
          <Skeleton className="h-5 w-full" />
        ) : history?.frequency ? (
          <>
            <FrequencyIndicator frequency={history.frequency} />
            <FrequencyStats frequency={history.frequency} />
            {history.frequency.lastServedDate && (
              <p className="text-xs text-muted-foreground">
                Last served:{" "}
                {new Date(history.frequency.lastServedDate).toLocaleDateString()}
              </p>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
