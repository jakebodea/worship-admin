import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, KeyRound, LinkIcon, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdminSession } from "@/lib/use-cases/admin/auth";
import {
  getUserAccountDetail,
  type AdminLinkedAccount,
} from "@/lib/use-cases/admin/get-account-activity";

export const dynamic = "force-dynamic";

function formatDateTime(value: string | null): string {
  if (!value) return "Never";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function splitScope(scope: string | null): string[] {
  if (!scope) return [];
  return scope.split(/[\s,]+/).map((part) => part.trim()).filter(Boolean);
}

function TokenStatus({ account }: { account: AdminLinkedAccount }) {
  const hasAccessExpiry = Boolean(account.accessTokenExpiresAt);
  const hasRefreshExpiry = Boolean(account.refreshTokenExpiresAt);

  return (
    <div className="flex flex-wrap gap-1">
      <Badge variant={hasAccessExpiry ? "secondary" : "outline"}>
        access {hasAccessExpiry ? formatDateTime(account.accessTokenExpiresAt) : "no expiry"}
      </Badge>
      <Badge variant={hasRefreshExpiry ? "secondary" : "outline"}>
        refresh {hasRefreshExpiry ? formatDateTime(account.refreshTokenExpiresAt) : "no expiry"}
      </Badge>
    </div>
  );
}

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  await requireAdminSession();
  const { userId } = await params;
  const user = await getUserAccountDetail(userId);

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-0 flex-1 overflow-auto bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
              <Link href="/admin">
                <ArrowLeft />
                Admin
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold tracking-normal">{user.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant="outline">{user.linkedAccounts} linked account(s)</Badge>
        </div>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border border-border/70 bg-card px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Active sessions</p>
              <ShieldCheck className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-normal">{user.activeSessions}</p>
          </div>
          <div className="rounded-md border border-border/70 bg-card px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Total logins</p>
              <KeyRound className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-normal">{user.loginEvents}</p>
          </div>
          <div className="rounded-md border border-border/70 bg-card px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Logins in 30 days</p>
              <CalendarClock className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-normal">{user.loginEvents30d}</p>
          </div>
          <div className="rounded-md border border-border/70 bg-card px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Last login</p>
              <LinkIcon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-sm font-medium">{formatDateTime(user.lastLoginAt)}</p>
          </div>
        </section>

        <section className="rounded-md border border-border/70 bg-card">
          <div className="border-b border-border/70 px-4 py-3">
            <h2 className="text-sm font-medium">Linked Planning Center Accounts</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              OAuth tokens are intentionally hidden; this shows identifiers and expiry metadata only.
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Church</TableHead>
                <TableHead>Provider account ID</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Token status</TableHead>
                <TableHead className="text-right">Events</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.linkedAccountDetails.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{account.providerId}</span>
                      <span className="text-xs text-muted-foreground">{account.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-48 flex-col">
                      <span className="font-medium">
                        {account.identity?.organizationName ?? "Unknown organization"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {account.identity?.organizationId ?? "No organization ID available"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{account.providerAccountId}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {splitScope(account.scope).map((scope) => (
                        <Badge key={scope} variant="outline">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <TokenStatus account={account} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{account.activityEvents}</TableCell>
                  <TableCell>{formatDateTime(account.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </main>
  );
}
