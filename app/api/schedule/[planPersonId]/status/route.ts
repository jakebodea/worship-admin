import { z } from "zod";
import { ApiError } from "@/lib/http/api-error";
import { handlePlanningCenterRoute } from "@/lib/http/planning-center-route";
import { logger } from "@/lib/logger";
import { planningCenterPeopleService } from "@/lib/planning-center/services/people-service";
import {
  getActivityRequestContext,
  recordActivityEvent,
} from "@/lib/db/activity-events";

export const dynamic = "force-dynamic";

const paramsSchema = z.object({
  planPersonId: z.string().min(1),
});

const bodySchema = z.object({
  status: z.enum(["C", "U", "D"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ planPersonId: string }> }
) {
  const activityRequestContext = getActivityRequestContext(request);
  const requestId = activityRequestContext.requestId ?? crypto.randomUUID();
  const log = logger.withRequest(request).child({ requestId });

  return handlePlanningCenterRoute(request, async (authContext) => {
    const recordStatusEventSafely = async (event: {
      success: boolean;
      statusCode: number;
      errorCode: string | null;
      planPersonId: string | null;
      status: "C" | "U" | "D" | null;
      metadata?: Record<string, unknown>;
    }) => {
      try {
        await recordActivityEvent({
          eventType: "schedule_status_change",
          actorUserId: authContext.session.user.id,
          actorAccountId: authContext.accountId,
          requestId,
          path: activityRequestContext.path,
          method: activityRequestContext.method,
          ipAddress: activityRequestContext.ipAddress,
          userAgent: activityRequestContext.userAgent,
          success: event.success,
          statusCode: event.statusCode,
          errorCode: event.errorCode,
          metadata: {
            planPersonId: event.planPersonId,
            status: event.status,
            ...event.metadata,
          },
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        log.warn({ err }, "Failed to record schedule status change activity event");
      }
    };

    let planPersonId: string | null = null;
    let nextStatus: "C" | "U" | "D" | null = null;

    try {
      const parsedParams = paramsSchema.safeParse(await params);
      if (!parsedParams.success) {
        log.warn(
          { issues: parsedParams.error.issues },
          "Invalid schedule status route params"
        );
        throw new ApiError(
          400,
          "INVALID_REQUEST",
          "Invalid request",
          parsedParams.error.issues
        );
      }
      planPersonId = parsedParams.data.planPersonId;

      const parsedBody = bodySchema.safeParse(await request.json());
      if (!parsedBody.success) {
        log.warn(
          { issues: parsedBody.error.issues },
          "Invalid schedule status request body"
        );
        throw new ApiError(
          400,
          "INVALID_REQUEST",
          "Invalid request",
          parsedBody.error.issues
        );
      }
      nextStatus = parsedBody.data.status;

      await planningCenterPeopleService.updatePlanPersonStatus(
        planPersonId,
        nextStatus
      );

      log.info(
        { planPersonId, status: nextStatus },
        "PlanPerson status updated successfully"
      );

      await recordStatusEventSafely({
        success: true,
        statusCode: 200,
        errorCode: null,
        planPersonId,
        status: nextStatus,
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        await recordStatusEventSafely({
          success: false,
          statusCode: error.status,
          errorCode: error.code,
          planPersonId,
          status: nextStatus,
        });
      } else {
        await recordStatusEventSafely({
          success: false,
          statusCode: 500,
          errorCode: "INTERNAL_SERVER_ERROR",
          planPersonId,
          status: nextStatus,
        });
      }

      throw error;
    }
  });
}
