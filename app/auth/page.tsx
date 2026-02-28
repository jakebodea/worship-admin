"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace("/");
      router.refresh();
    }
  }, [router, session]);

  const handleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await authClient.signIn.oauth2({
        providerId: "planning-center",
        callbackURL: "/",
        errorCallbackURL: "/auth",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to start sign in. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-2 text-center">
            Sign In
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Continue with your Planning Center account
          </p>

          <div className="space-y-4">
            {error && (
              <div className="text-sm text-destructive text-center">
                {error}
              </div>
            )}

            <Button
              type="button"
              className="w-full"
              onClick={handleSignIn}
              disabled={loading || isPending}
            >
              {loading || isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting...
                </span>
              ) : (
                "Continue with Planning Center"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
