import { NextResponse } from "next/server";
import { pcClient } from "@/lib/planning-center";
import type { Person, RawPerson, RawTeamPosition } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get all people from teams (limited to avoid rate limits)
    const { people: rawPeople } = await pcClient.getAllPeopleFromTeams();

    // Get team positions for all people in parallel (but limit concurrency)
    const peopleWithPositions = await Promise.all(
      rawPeople.slice(0, 50).map(async (rawPerson) => {
        const person = rawPerson as unknown as RawPerson;
        
        // Get team position assignments for this person
        let positions: Array<{ id: string; name: string; teamId: string }> = [];
        
        try {
          const assignmentsResponse = await pcClient.getPersonTeamPositionAssignments(person.id);
          
          // Extract team positions from included resources
          const teamPositions = assignmentsResponse.included.filter(
            (item) => item.type === "TeamPosition"
          );

          positions = teamPositions.map((tp) => {
            const pos = tp as unknown as RawTeamPosition;
            // Get team ID from relationships
            const teamData = pos.relationships?.team?.data;
            let teamId = "";
            
            if (teamData) {
              teamId = Array.isArray(teamData) 
                ? teamData[0]?.id || ""
                : teamData.id || "";
            }
            
            // If not in relationships, find in included
            if (!teamId) {
              const team = assignmentsResponse.included.find(
                (item) => item.type === "Team"
              );
              teamId = team?.id || "";
            }

            return {
              id: pos.id,
              name: (pos.attributes.name as string) || "",
              teamId,
            };
          });
        } catch (error) {
          // Skip if we can't get positions for this person
          console.warn(`Failed to get positions for person ${person.id}:`, error);
        }

        // Transform to our Person type
        const transformedPerson: Person = {
          id: person.id,
          firstName: (person.attributes.first_name as string) || "",
          lastName: (person.attributes.last_name as string) || "",
          fullName: `${person.attributes.first_name || ""} ${person.attributes.last_name || ""}`.trim(),
          photoUrl: (person.attributes.photo_url as string) || null,
          photoThumbnailUrl: (person.attributes.photo_thumbnail_url as string) || null,
          archived: !!person.attributes.archived_at,
          positions,
        };

        return transformedPerson;
      })
    );

    // Filter out archived people and those without positions
    const activePeopleWithPositions = peopleWithPositions.filter(
      (person) => !person.archived && person.positions.length > 0
    );

    return NextResponse.json(activePeopleWithPositions);
  } catch (error) {
    console.error("Error fetching people:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch people", details: errorMessage },
      { status: 500 }
    );
  }
}
