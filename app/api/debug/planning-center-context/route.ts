import { auth } from "@/lib/auth";
import { getPlanningCenterIdentityForAccount } from "@/lib/auth/planning-center-identity";
import { ApiError } from "@/lib/http/api-error";
import { handleRoute } from "@/lib/http/route-handler";

const PLANNING_CENTER_PROVIDER_ID = "planning-center";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleRoute(async () => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      throw new ApiError(401, "UNAUTHORIZED", "Sign in required");
    }

    const accounts = await auth.api.listUserAccounts({
      headers: request.headers,
    });

    const planningCenterAccounts = accounts
      .filter((account) => account.providerId === PLANNING_CENTER_PROVIDER_ID)
      .sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return bTime - aTime;
      });

    const selectedAccount = planningCenterAccounts[0] ?? null;

    const pcoUser = selectedAccount
      ? await getPlanningCenterIdentityForAccount(request, selectedAccount.id)
      : null;

    return {
      session: {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      selectedPlanningCenterAccountId: selectedAccount?.id ?? null,
      planningCenterAccounts,
      planningCenterIdentity: pcoUser,
    };
  });
}
