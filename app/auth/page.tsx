"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HttpClientError, postJson } from "@/lib/http/client";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await postJson<{ success: boolean }>("/api/auth", { password });
      if (data.success) {
        // Redirect to home page after successful authentication
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      if (error instanceof HttpClientError) {
        setError(error.message || "Invalid password");
      } else {
        setError("An error occurred. Please try again.");
      }
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-2 text-center">
            Access Required
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Please enter the password to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 pr-10 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {error && (
              <div className="text-sm text-destructive text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !password}
            >
              {loading ? "Verifying..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
