"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

function AuthQueryCacheSync({ queryClient }: { queryClient: QueryClient }) {
  const { data: session, isPending } = authClient.useSession();
  const previousUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (isPending) {
      return;
    }

    const nextUserId = session?.user.id ?? null;

    if (previousUserIdRef.current === undefined) {
      previousUserIdRef.current = nextUserId;
      return;
    }

    if (previousUserIdRef.current !== nextUserId) {
      queryClient.clear();
    }

    previousUserIdRef.current = nextUserId;
  }, [isPending, queryClient, session?.user.id]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthQueryCacheSync queryClient={queryClient} />
      {children}
    </QueryClientProvider>
  );
}
