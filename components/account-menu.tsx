"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, Loader2, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { authClient } from "@/lib/auth-client";
import { getJson, postJson } from "@/lib/http/client";

type PlanningCenterAccount = {
  id: string;
  providerId: string;
  updatedAt: string;
  identity: {
    sub: string | null;
    name: string | null;
    email: string | null;
    organizationId: string | null;
    organizationName: string | null;
  } | null;
};

type PlanningCenterAccountsResponse = {
  session: {
    userId: string;
    name: string;
    email: string;
    image: string | null;
  };
  selectedAccountId: string | null;
  accounts: PlanningCenterAccount[];
};

function initialsFromName(name: string | null | undefined): string {
  if (!name) return "?";
  const trimmed = name.trim();
  if (!trimmed) return "?";

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function AccountMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<PlanningCenterAccountsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [switchingAccountId, setSwitchingAccountId] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string>("");

  const selectedAccount = useMemo(() => {
    if (!data) return null;
    if (!data.selectedAccountId) return data.accounts[0] ?? null;
    return data.accounts.find((account) => account.id === data.selectedAccountId) ?? null;
  }, [data]);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const response = await getJson<PlanningCenterAccountsResponse>(
        "/api/planning-center/accounts"
      );
      setData(response);
      setError("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load account details";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAccounts();
  }, []);

  const handleSelectAccount = async (accountId: string) => {
    if (switchingAccountId || isSigningOut) return;
    setSwitchingAccountId(accountId);
    try {
      await postJson<{ success: boolean; selectedAccountId: string }>(
        "/api/planning-center/accounts",
        { accountId }
      );
      await loadAccounts();
      await queryClient.invalidateQueries();
      router.refresh();
      setOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to switch organization";
      setError(message);
    } finally {
      setSwitchingAccountId(null);
    }
  };

  const handleSignOut = async () => {
    if (isSigningOut || switchingAccountId) return;
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.replace("/auth");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  const avatarName =
    selectedAccount?.identity?.name || data?.session.name || data?.session.email || null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2 px-2"
          aria-label="Open account menu"
        >
          <Avatar className="size-7">
            {data?.session.image ? <AvatarImage src={data.session.image} alt={avatarName ?? "User"} /> : null}
            <AvatarFallback>{initialsFromName(avatarName)}</AvatarFallback>
          </Avatar>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-3">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">{data?.session.name ?? "Account"}</p>
            <p className="text-xs text-muted-foreground">{data?.session.email ?? ""}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Organizations
            </p>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading organizations...
              </div>
            ) : data?.accounts.length ? (
              <div className="space-y-1">
                {data.accounts.map((account) => {
                  const isSelected = account.id === data.selectedAccountId;
                  const orgName = account.identity?.organizationName || "Unknown organization";

                  return (
                    <Button
                      key={account.id}
                      type="button"
                      variant="ghost"
                      className="h-auto w-full justify-between px-2 py-2 text-left"
                      onClick={() => void handleSelectAccount(account.id)}
                      disabled={Boolean(switchingAccountId) || isSigningOut}
                    >
                      <span className="min-w-0 truncate text-sm">{orgName}</span>
                      <span className="ml-2 shrink-0">
                        {switchingAccountId === account.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : isSelected ? (
                          <Check className="size-4" />
                        ) : null}
                      </span>
                    </Button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No linked Planning Center organizations found.
              </p>
            )}
          </div>

          {error ? <p className="text-xs text-destructive">{error}</p> : null}

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive/20"
            onClick={() => void handleSignOut()}
            disabled={isSigningOut || Boolean(switchingAccountId)}
          >
            {isSigningOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
            {isSigningOut ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
