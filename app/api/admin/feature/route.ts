import { auth } from "@/lib/auth";
import {
  getDevBypassSession,
  isDevAuthBypassEnabled,
  loadDevBypassIdentity,
} from "@/lib/auth/dev-bypass";
import { handleRoute } from "@/lib/http/route-handler";
import { isAdminEmail } from "@/lib/use-cases/admin/get-account-activity";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleRoute(async () => {
    const session = isDevAuthBypassEnabled()
      ? getDevBypassSession(await loadDevBypassIdentity())
      : await auth.api.getSession({
          headers: request.headers,
        });

    return {
      enabled: isAdminEmail(session?.user.email),
    };
  });
}
