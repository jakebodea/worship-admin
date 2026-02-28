import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError } from "@/lib/http/api-error";
import { handlePlanningCenterRoute } from "@/lib/http/planning-center-route";
import { logger } from "@/lib/logger";
import { planningCenterPeopleService } from "@/lib/planning-center/services/people-service";
import { planningCenterCatalogService } from "@/lib/planning-center/services/catalog-service";
import { findIncluded } from "@/lib/planning-center/utils";
import type { RawTeamPosition, RawTeam } from "@/lib/types";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  serviceTypeId: z.string().min(1),
  personId: z.string().min(1),
  planId: z.string().min(1),
  teamId: z.string().min(1),
  positionId: z.string().min(1),
});

export async function POST(request: Request) {
  const log = logger.withRequest(request);
  return handlePlanningCenterRoute(request, async () => {
    try {
      const parsed = bodySchema.safeParse(await request.json());
      if (!parsed.success) {
        log.warn({ issues: parsed.error.issues }, "Invalid schedule request body");
        throw new ApiError(400, "INVALID_REQUEST", "Invalid request", parsed.error.issues);
      }
      const { serviceTypeId, personId, planId, teamId, positionId } = parsed.data;

      const { data: teamPositions, included } =
        await planningCenterCatalogService.getServiceTypeTeamPositionsWithTeams(serviceTypeId);
      const selectedPosition = teamPositions.find((p) => p.id === positionId) as
        | (RawTeamPosition & { relationships?: { team?: { data?: { id: string } } } })
        | undefined;
      if (!selectedPosition) {
        throw new ApiError(400, "INVALID_REQUEST", "Selected position was not found for this service type");
      }
      const selectedPositionTeamId = selectedPosition.relationships?.team?.data?.id;
      if (!selectedPositionTeamId || selectedPositionTeamId !== teamId) {
        throw new ApiError(400, "INVALID_REQUEST", "Selected position does not belong to selected team");
      }

      const selectedTeam = findIncluded(included, "Team", teamId) as RawTeam | undefined;
      const selectedTeamName = (selectedTeam?.attributes?.name as string | undefined) || "";
      const selectedPositionName = selectedPosition.attributes?.name || "";

      const personAssignments =
        await planningCenterPeopleService.getPersonTeamPositionAssignments(personId);
      const hasPositionAssignment = personAssignments.data.some((assignment) => {
        const rel = assignment.relationships?.team_position?.data;
        const assignmentPositionId = Array.isArray(rel) ? rel[0]?.id : rel?.id;
        return assignmentPositionId === positionId;
      });
      if (!hasPositionAssignment) {
        throw new ApiError(400, "INVALID_REQUEST", "Person is not assigned to the selected team position");
      }

      const data = await planningCenterPeopleService.createPlanPerson(
        serviceTypeId,
        personId,
        planId,
        teamId,
        selectedPositionName
      );

      const createdTeamPositionName = (data.attributes.team_position_name as string | undefined) || "";
      if (selectedPositionName && createdTeamPositionName) {
        // Planning Center may return either "Team - Position" or just "Position".
        // Treat either as valid as long as the selected position name matches.
        const parts = createdTeamPositionName.split(" - ");
        const createdPositionName = parts.length > 1 ? parts.slice(1).join(" - ") : parts[0];
        const positionMatches =
          createdPositionName === selectedPositionName ||
          createdTeamPositionName === selectedPositionName;

        const createdTeamName = parts.length > 1 ? parts[0] : "";
        const teamMatches =
          !selectedTeamName ||
          !createdTeamName ||
          createdTeamName === selectedTeamName;

        if (!teamMatches || !positionMatches) {
          return NextResponse.json(
            {
              error:
                "PlanPerson was created but did not match selected team/position. Please check split-team/time settings in Planning Center.",
              code: "POSITION_MISMATCH",
              details: {
                selected: {
                  teamId,
                  teamName: selectedTeamName,
                  positionId,
                  positionName: selectedPositionName,
                },
                created: {
                  planPersonId: data.id,
                  teamPositionName: createdTeamPositionName,
                },
              },
            },
            { status: 409 }
          );
        }
      }

      log.info(
        { serviceTypeId, personId, planId, teamId, positionId, planPersonId: data.id },
        "Person scheduled successfully"
      );

      return { success: true, data };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const errorMessage = err.message || "";

      if (errorMessage.includes("has already been scheduled for this position")) {
        log.info({ err }, "Person already scheduled for selected position");
        return NextResponse.json(
          {
            error: "Person is already scheduled for this selected plan/team/position",
            code: "ALREADY_SCHEDULED",
            details: errorMessage,
          },
          { status: 409 }
        );
      }
      throw error;
    }
  });
}
