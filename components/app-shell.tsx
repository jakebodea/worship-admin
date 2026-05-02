"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Keyboard,
  Laptop,
  Loader2,
  LogOut,
  Moon,
  Settings2,
  Sun,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { getJson, postJson } from "@/lib/http/client";
import { APP_SHORTCUTS, SHORTCUTS_PALETTE_HOTKEY } from "@/lib/app-hotkeys";
import { cn } from "@/lib/utils";
import { HotkeyChord } from "@/components/hotkey-chord";
import { SidebarToggleHotkey } from "@/components/sidebar-toggle-hotkey";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

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

const SIDEBAR_WIDTH_STORAGE_KEY = "worshipadmin:sidebar-width";
const DEFAULT_SIDEBAR_WIDTH = 288;
const MIN_SIDEBAR_WIDTH = 232;
const MAX_SIDEBAR_WIDTH = 380;

function clampSidebarWidth(width: number): number {
  return Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, width));
}

function initialsFromName(name: string | null | undefined): string {
  if (!name) return "WA";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "WA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function readStoredSidebarWidth(): number {
  if (typeof window === "undefined") return DEFAULT_SIDEBAR_WIDTH;
  const stored = Number(window.localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY));
  return Number.isFinite(stored) ? clampSidebarWidth(stored) : DEFAULT_SIDEBAR_WIDTH;
}

function SidebarResizeRail({
  width,
  onWidthChange,
  onCollapsePreviewChange,
}: {
  width: number;
  onWidthChange: (width: number) => void;
  onCollapsePreviewChange?: (preview: boolean) => void;
}) {
  const { isMobile, setOpen } = useSidebar();
  const pendingCollapseRef = useRef(false);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (isMobile) return;
      event.preventDefault();
      const target = event.currentTarget;
      target.setPointerCapture(event.pointerId);

      const startX = event.clientX;
      const startWidth = width;
      const prevUserSelect = document.body.style.userSelect;
      document.body.style.userSelect = "none";

      pendingCollapseRef.current = false;
      onCollapsePreviewChange?.(false);

      const detach = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerUp);
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        document.body.style.userSelect = prevUserSelect;
        onCollapsePreviewChange?.(false);
        if (pendingCollapseRef.current) {
          setOpen(false);
        }
        pendingCollapseRef.current = false;
        if (target.hasPointerCapture(upEvent.pointerId)) {
          target.releasePointerCapture(upEvent.pointerId);
        }
        detach();
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const nextWidth = startWidth + moveEvent.clientX - startX;
        if (nextWidth < MIN_SIDEBAR_WIDTH) {
          pendingCollapseRef.current = true;
          onCollapsePreviewChange?.(true);
          return;
        }
        pendingCollapseRef.current = false;
        onCollapsePreviewChange?.(false);
        onWidthChange(clampSidebarWidth(nextWidth));
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    },
    [isMobile, onCollapsePreviewChange, onWidthChange, setOpen, width]
  );

  const handleDoubleClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (isMobile) return;
      onCollapsePreviewChange?.(false);
      pendingCollapseRef.current = false;
      onWidthChange(MIN_SIDEBAR_WIDTH);
    },
    [isMobile, onCollapsePreviewChange, onWidthChange]
  );

  if (isMobile) return null;

  return (
    <button
      type="button"
      aria-label="Resize sidebar. Double-click for minimum width."
      title="Drag to resize. Double-click for minimum width."
      tabIndex={-1}
      className={cn(
        /* Inset card uses m-2 + rounded-lg (~--radius); shorten rail slightly so it avoids corner curves */
        "absolute top-3 right-0 bottom-3 z-[70] hidden w-3 cursor-col-resize rounded-none border-0 bg-transparent p-0 md:block",
        "touch-none after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-px after:rounded-full after:bg-border after:opacity-0 after:transition-opacity hover:after:opacity-100",
        "focus-visible:outline-none focus-visible:after:opacity-100"
      )}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
    />
  );
}

type TopBarView = "schedule" | "lineup" | "plan";

function parseTopBarView(value: string | null): TopBarView {
  if (value === "lineup") return "lineup";
  if (value === "plan") return "plan";
  return "schedule";
}

function AppTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasPlan = pathname === "/schedule/plan";
  const view = parseTopBarView(searchParams.get("view"));

  const handleViewChange = useCallback(
    (next: string) => {
      const parsed = parseTopBarView(next);
      const params = new URLSearchParams(searchParams.toString());
      if (parsed === "schedule") {
        params.delete("view");
      } else {
        params.set("view", parsed);
      }
      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      startTransition(() => router.replace(url));
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex w-full min-w-0 items-center gap-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {hasPlan ? (
              <BreadcrumbLink asChild>
                <Link href="/schedule">Schedule</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>Schedule</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {hasPlan ? (
        <Tabs value={view} onValueChange={handleViewChange} className="ml-auto">
          <TabsList className="h-8">
            <TabsTrigger value="schedule" className="px-3 text-xs">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="lineup" className="px-3 text-xs">
              Lineup
            </TabsTrigger>
            <TabsTrigger value="plan" className="px-3 text-xs">
              Plan
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ) : null}
    </div>
  );
}

function SidebarAccountPanel({ onOpenShortcuts }: { onOpenShortcuts: () => void }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setTheme, theme } = useTheme();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [data, setData] = useState<PlanningCenterAccountsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [switchingAccountId, setSwitchingAccountId] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  const selectedAccount = useMemo(() => {
    if (!data) return null;
    if (!data.selectedAccountId) return data.accounts[0] ?? null;
    return data.accounts.find((account) => account.id === data.selectedAccountId) ?? null;
  }, [data]);

  const avatarName =
    selectedAccount?.identity?.name || data?.session.name || data?.session.email || null;
  const organizationName = selectedAccount?.identity?.organizationName ?? "worshipadmin.com";

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getJson<PlanningCenterAccountsResponse>("/api/planning-center/accounts");
      setData(response);
      setError("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load account details";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

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
      await loadAccounts();
      await queryClient.invalidateQueries();
      router.refresh();
      setAccountMenuOpen(false);
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
      startTransition(() => {
        router.replace("/auth");
        router.refresh();
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={accountMenuOpen} onOpenChange={setAccountMenuOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="size-6 rounded-md">
                {data?.session.image ? <AvatarImage src={data.session.image} alt={avatarName ?? "User"} /> : null}
                <AvatarFallback className="rounded-md bg-primary text-[10px] font-medium text-primary-foreground">
                  {initialsFromName(avatarName)}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate text-left text-sm font-medium">{organizationName}</span>
              <ChevronDown
                className={cn(
                  "ml-auto size-3.5 text-muted-foreground transition-transform group-data-[collapsible=icon]:hidden",
                  accountMenuOpen ? "rotate-180" : null
                )}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="start"
            className="max-w-none min-w-[14rem] w-[var(--radix-dropdown-menu-trigger-width)] gap-0 rounded-xl border-border/60 bg-popover p-1 shadow-xl shadow-black/35"
          >
            <DropdownMenuLabel className="cursor-default rounded-none px-2.5 py-2.5 pb-2 font-normal">
              <span className="block truncate text-sm font-semibold text-foreground">
                {data?.session.name ?? "Account"}
              </span>
              <span className="mt-1 block truncate text-xs text-muted-foreground">{data?.session.email ?? ""}</span>
            </DropdownMenuLabel>

            {(loading && !data) || (data !== null && data.accounts.length > 1) ? (
              <>
                <DropdownMenuSeparator className="my-0 bg-border/50" />
                {loading && !data ? (
                  <DropdownMenuItem disabled className="rounded-sm px-2.5 py-2 text-sm">
                    Loading…
                  </DropdownMenuItem>
                ) : (
                  data!.accounts.map((account) => {
                    const isSelected = account.id === data!.selectedAccountId;
                    const orgName = account.identity?.organizationName || "Unknown organization";
                    return (
                      <DropdownMenuItem
                        key={account.id}
                        className="gap-2 rounded-sm px-2.5 py-2 text-sm"
                        disabled={Boolean(switchingAccountId) || isSigningOut}
                        onSelect={(event) => {
                          event.preventDefault();
                          void handleSelectAccount(account.id);
                        }}
                      >
                        <span className="min-w-0 flex-1 truncate">{orgName}</span>
                        {switchingAccountId === account.id ? (
                          <Loader2 className="size-4 animate-spin shrink-0" />
                        ) : (
                          <Check className={cn("size-4 shrink-0", isSelected ? "opacity-80" : "invisible")} />
                        )}
                      </DropdownMenuItem>
                    );
                  })
                )}
              </>
            ) : null}

            <DropdownMenuSeparator className="my-0 bg-border/50" />

            <DropdownMenuLabel className="px-2.5 pt-2 pb-1.5 text-xs font-medium text-muted-foreground">
              Appearance
            </DropdownMenuLabel>
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const selected = (theme ?? "system") === option.value;
              return (
                <DropdownMenuItem
                  key={option.value}
                  className="gap-2 rounded-sm px-2.5 py-2 text-sm"
                  onSelect={() => setTheme(option.value)}
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span>{option.label}</span>
                  <Check className={cn("size-4 shrink-0", selected ? "ml-auto opacity-80" : "invisible ml-auto")} />
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator className="my-0 bg-border/50" />

            <DropdownMenuItem
              className="rounded-sm px-2.5 py-2 text-sm"
              onSelect={() => onOpenShortcuts()}
            >
              <Keyboard className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="flex-1">Keyboard shortcuts</span>
              <HotkeyChord
                id="acct-menu-shortcuts"
                binding={SHORTCUTS_PALETTE_HOTKEY}
                className="ml-2 shrink-0 [&_[data-slot=kbd]]:h-7 [&_[data-slot=kbd]]:min-h-7 [&_[data-slot=kbd]]:border-border/50 [&_[data-slot=kbd]]:bg-muted/40 [&_[data-slot=kbd]]:px-1.5 [&_[data-slot=kbd]]:text-[11px]"
              />
            </DropdownMenuItem>

            {error ? <p className="mx-2 my-1.5 text-[11px] leading-snug text-destructive">{error}</p> : null}

            <DropdownMenuSeparator className="my-0 bg-border/50" />

            <DropdownMenuItem
              variant="destructive"
              className="rounded-sm px-2.5 py-2 text-sm"
              disabled={isSigningOut || Boolean(switchingAccountId)}
              onSelect={() => void handleSignOut()}
            >
              {isSigningOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
              {isSigningOut ? "Signing out…" : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function AppSidebar({
  trailingChrome,
  collapsePreview = false,
}: {
  trailingChrome: ReactNode;
  collapsePreview?: boolean;
}) {
  const pathname = usePathname();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useHotkey(SHORTCUTS_PALETTE_HOTKEY, () => setShortcutsOpen(true), { ignoreInputs: true });

  return (
    <>
      <Sidebar variant="inset" collapsible="offcanvas" collapsePreview={collapsePreview} trailingChrome={trailingChrome}>
        <SidebarHeader>
          <SidebarAccountPanel onOpenShortcuts={() => setShortcutsOpen(true)} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith("/schedule")}
                    tooltip="Schedule"
                  >
                    <Link href="/schedule">
                      <CalendarDays />
                      <span>Schedule</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton type="button" tooltip="Shortcuts" onClick={() => setShortcutsOpen(true)}>
                <Settings2 />
                <span>Shortcuts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shortcuts</DialogTitle>
            <DialogDescription>Keyboard shortcuts available in worshipadmin.com.</DialogDescription>
          </DialogHeader>
          <dl className="grid gap-3 text-sm">
            {APP_SHORTCUTS.map((shortcut) => (
              <div
                key={shortcut.id}
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1"
              >
                <dt className="text-muted-foreground">{shortcut.label}</dt>
                <dd>
                  <HotkeyChord id={shortcut.id} binding={shortcut.binding} />
                </dd>
              </div>
            ))}
          </dl>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [sidebarCollapsePreview, setSidebarCollapsePreview] = useState(false);

  useEffect(() => {
    setSidebarWidth(readStoredSidebarWidth());
  }, []);

  const handleSidebarWidthChange = useCallback((nextWidth: number) => {
    const clamped = clampSidebarWidth(nextWidth);
    setSidebarWidth(clamped);
    window.localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(clamped));
  }, []);

  if (isAuthRoute) return <>{children}</>;

  return (
    <SidebarProvider
      className="h-svh min-h-0 overflow-hidden"
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <SidebarToggleHotkey />
      <AppSidebar
        collapsePreview={sidebarCollapsePreview}
        trailingChrome={
          <SidebarResizeRail
            width={sidebarWidth}
            onWidthChange={handleSidebarWidthChange}
            onCollapsePreviewChange={setSidebarCollapsePreview}
          />
        }
      />
      <SidebarInset className="min-h-0 overflow-hidden">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/50 px-3">
          <SidebarTrigger />
          <Suspense fallback={null}>
            <AppTopBar />
          </Suspense>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
