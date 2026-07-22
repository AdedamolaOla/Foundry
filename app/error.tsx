"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Something went wrong
      </h2>
      <p className="mt-2 text-sm text-[var(--foreground-muted)]">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[var(--border-default)] px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
