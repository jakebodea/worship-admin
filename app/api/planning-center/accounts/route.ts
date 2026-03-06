import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getPlanningCenterIdentityForAccount } from "@/lib/auth/planning-center-identity";
import {
  getSelectedPlanningCenterAccountId,
  PLANNING_CENTER_SELECTED_ACCOUNT_COOKIE,
} from "@/lib/auth/planning-center-session";
import { ApiError } from "@/lib/http/api-error";
import { handleRoute } from "@/lib/http/route-handler";
import type {
  DeletePlanningCenterAccountResponse,
  PlanningCenterAccountsResponse,
} from "@/lib/planning-center/accounts";

const PLANNING_CENTER_PROVIDER_ID = "planning-center";

const postBodySchema = z.object({
  accountId: z.string().min(1),
});

const deleteBodySchema = z.object({
  accountId: z.string().min(1),
});

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleRoute(async () => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      throw new ApiError(401, "UNAUTHORIZED", "Sign in required");
    }

    const allAccounts = await auth.api.listUserAccounts({
      headers: request.headers,
    });

    const planningCenterAccounts = allAccounts
      .filter((account) => account.providerId === PLANNING_CENTER_PROVIDER_ID)
      .sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return bTime - aTime;
      });

    const selectedFromCookie = getSelectedPlanningCenterAccountId(request);
    const selectedAccount =
      (selectedFromCookie
        ? planningCenterAccounts.find((account) => account.id === selectedFromCookie)
        : null) ?? planningCenterAccounts[0] ?? null;

    const accountsWithIdentity = await Promise.all(
      planningCenterAccounts.map(async (account) => {
        const identity = await getPlanningCenterIdentityForAccount(request, account.id);
        return {
          ...account,
          identity,
        };
      })
    );

    const response: PlanningCenterAccountsResponse = {
      session: {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      },
      selectedAccountId: selectedAccount?.id ?? null,
      accounts: accountsWithIdentity,
    };

    return response;
  });
}

export async function POST(request: Request) {
  return handleRoute(async () => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      throw new ApiError(401, "UNAUTHORIZED", "Sign in required");
    }

    const parsed = postBodySchema.safeParse(await request.json());
    if (!parsed.success) {
      throw new ApiError(400, "INVALID_REQUEST", "Invalid request", parsed.error.issues);
    }

    const allAccounts = await auth.api.listUserAccounts({
      headers: request.headers,
    });

    const account = allAccounts.find(
      (candidate) =>
        candidate.id === parsed.data.accountId &&
        candidate.providerId === PLANNING_CENTER_PROVIDER_ID
    );

    if (!account) {
      throw new ApiError(404, "NOT_FOUND", "Planning Center account not found");
    }

    const response = NextResponse.json({
      success: true,
      selectedAccountId: account.id,
    });

    response.cookies.set(
      PLANNING_CENTER_SELECTED_ACCOUNT_COOKIE,
      encodeURIComponent(account.id),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      }
    );

    return response;
  });
}

export async function DELETE(request: Request) {
  return handleRoute(async () => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      throw new ApiError(401, "UNAUTHORIZED", "Sign in required");
    }

    const parsed = deleteBodySchema.safeParse(await request.json());
    if (!parsed.success) {
      throw new ApiError(400, "INVALID_REQUEST", "Invalid request", parsed.error.issues);
    }

    const allAccounts = await auth.api.listUserAccounts({
      headers: request.headers,
    });

    const planningCenterAccounts = allAccounts
      .filter((account) => account.providerId === PLANNING_CENTER_PROVIDER_ID)
      .sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return bTime - aTime;
      });

    const account = planningCenterAccounts.find(
      (candidate) => candidate.id === parsed.data.accountId
    );

    if (!account) {
      throw new ApiError(404, "NOT_FOUND", "Planning Center account not found");
    }

    try {
      await auth.api.unlinkAccount({
        headers: request.headers,
        body: {
          providerId: PLANNING_CENTER_PROVIDER_ID,
          accountId: account.accountId,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete organization";
      throw new ApiError(400, "ACCOUNT_UNLINK_FAILED", message);
    }

    const remainingAccounts = planningCenterAccounts.filter(
      (candidate) => candidate.id !== account.id
    );
    const selectedFromCookie = getSelectedPlanningCenterAccountId(request);
    const nextSelectedAccount =
      selectedFromCookie === account.id
        ? remainingAccounts[0] ?? null
        : (selectedFromCookie
            ? remainingAccounts.find((candidate) => candidate.id === selectedFromCookie)
            : null) ?? remainingAccounts[0] ?? null;

    const responseBody: DeletePlanningCenterAccountResponse = {
      success: true,
      deletedAccountId: account.id,
      selectedAccountId: nextSelectedAccount?.id ?? null,
      remainingAccountCount: remainingAccounts.length,
    };

    const response = NextResponse.json(responseBody);

    if (nextSelectedAccount) {
      response.cookies.set(
        PLANNING_CENTER_SELECTED_ACCOUNT_COOKIE,
        encodeURIComponent(nextSelectedAccount.id),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        }
      );
    } else {
      response.cookies.delete(PLANNING_CENTER_SELECTED_ACCOUNT_COOKIE);
    }

    return response;
  });
}
