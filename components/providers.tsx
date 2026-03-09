"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
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
      <Toaster richColors position={isMobile ? "top-center" : undefined} />
    </QueryClientProvider>
  );
}
