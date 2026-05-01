"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
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
      {children}
      {process.env.NODE_ENV !== "production" ? (
        <ReactQueryDevtools initialIsOpen={true} buttonPosition="bottom-right" />
      ) : null}
      <Toaster richColors position={isMobile ? "top-center" : undefined} />
    </QueryClientProvider>
  );
}
