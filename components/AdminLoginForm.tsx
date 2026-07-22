"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AdminLoginForm({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <label htmlFor="admin-email" className="block text-sm font-medium text-[var(--foreground-muted)]">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-placeholder)] focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="block text-sm font-medium text-[var(--foreground-muted)]">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-placeholder)] focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[var(--primary)] py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
