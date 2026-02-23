import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/http/api-error";
import { runWithPlanningCenterRequestAuth } from "@/lib/planning-center/request-auth-context";

const PLANNING_CENTER_PROVIDER_ID = "planning-center";

export type PlanningCenterUserAuthContext = {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  accessToken: string;
  scopes: string[];
};

export async function requirePlanningCenterAccessToken(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    throw new ApiError(401, "UNAUTHORIZED", "Sign in with Planning Center to continue");
  }

  try {
    const token = await auth.api.getAccessToken({
      headers: request.headers,
      body: {
        providerId: PLANNING_CENTER_PROVIDER_ID,
      },
    });

    return {
      session,
      accessToken: token.accessToken,
      scopes: token.scopes,
    };
  } catch {
    const refreshed = await auth.api.refreshToken({
      headers: request.headers,
      body: {
        providerId: PLANNING_CENTER_PROVIDER_ID,
      },
    });

    if (!refreshed.accessToken) {
      throw new ApiError(
        401,
        "PLANNING_CENTER_REAUTH_REQUIRED",
        "Planning Center connection expired. Please sign in again."
      );
    }

    return {
      session,
      accessToken: refreshed.accessToken,
      scopes: refreshed.scope ? refreshed.scope.split(/\s+/).filter(Boolean) : [],
    };
  }
}

export async function withPlanningCenterUser<T>(
  request: Request,
  handler: (ctx: PlanningCenterUserAuthContext) => Promise<T>
): Promise<T> {
  const authContext = await requirePlanningCenterAccessToken(request);

  return runWithPlanningCenterRequestAuth(
    { accessToken: authContext.accessToken },
    async () => handler(authContext)
  );
}
