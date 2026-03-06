"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, Loader2, LogOut, MoreHorizontal, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { authClient } from "@/lib/auth-client";
import { deleteJson, getJson, HttpClientError, postJson } from "@/lib/http/client";
import type {
  DeletePlanningCenterAccountResponse,
  PlanningCenterAccount,
  PlanningCenterAccountsResponse,
} from "@/lib/planning-center/accounts";

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
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PlanningCenterAccount | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string>("");

  const selectedAccount = useMemo(() => {
    if (!data) return null;
    if (!data.selectedAccountId) return data.accounts[0] ?? null;
    return data.accounts.find((account) => account.id === data.selectedAccountId) ?? null;
  }, [data]);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getJson<PlanningCenterAccountsResponse>(
        "/api/planning-center/accounts"
      );
      setData(response);
      setError("");
    } catch (err) {
      if (err instanceof HttpClientError && err.status === 401) {
        queryClient.clear();
        router.replace("/auth");
        router.refresh();
        return;
      }

      const message = err instanceof Error ? err.message : "Failed to load account details";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [queryClient, router]);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  const handleSelectAccount = async (accountId: string) => {
    if (switchingAccountId || isSigningOut) return;
    setSwitchingAccountId(accountId);
    try {
      await postJson<{ success: boolean; selectedAccountId: string }>(
        "/api/planning-center/accounts",
        { accountId }
      );
      queryClient.clear();
      await loadAccounts();
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
      queryClient.clear();
      await authClient.signOut();
      router.replace("/auth");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteTarget || deletingAccountId || switchingAccountId || isSigningOut) return;

    setDeletingAccountId(deleteTarget.id);
    setError("");

    try {
      const response = await deleteJson<DeletePlanningCenterAccountResponse>(
        "/api/planning-center/accounts",
        { accountId: deleteTarget.id }
      );

      queryClient.clear();
      setDeleteTarget(null);

      if (response.remainingAccountCount === 0) {
        router.replace("/auth");
        router.refresh();
        return;
      }

      await loadAccounts();
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete organization";
      setError(message);
    } finally {
      setDeletingAccountId(null);
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
                    <div key={account.id} className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-auto flex-1 justify-between px-2 py-2 text-left"
                        onClick={() => void handleSelectAccount(account.id)}
                        disabled={Boolean(switchingAccountId) || isSigningOut || Boolean(deletingAccountId)}
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

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        aria-label={`Manage ${orgName}`}
                        onClick={() => {
                          setOpen(false);
                          setDeleteTarget(account);
                        }}
                        disabled={Boolean(switchingAccountId) || isSigningOut || Boolean(deletingAccountId)}
                      >
                        {deletingAccountId === account.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <MoreHorizontal className="size-4" />
                        )}
                      </Button>
                    </div>
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

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete organization link?</DialogTitle>
            <DialogDescription>
              Remove {deleteTarget?.identity?.organizationName || "this organization"} from this account.
              You can always link it again later.
            </DialogDescription>
          </DialogHeader>

          {error ? <p className="text-xs text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={Boolean(deletingAccountId)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleDeleteAccount()}
              disabled={Boolean(deletingAccountId)}
            >
              {deletingAccountId ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Delete link
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Popover>
  );
}
