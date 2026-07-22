"use client";

import { useState } from "react";
import type { Contribution } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdminDashboardProps {
  pending: Contribution[];
  rejected: Contribution[];
}

export function AdminDashboard({ pending, rejected }: AdminDashboardProps) {
  const [items, setItems] = useState({ pending, rejected });
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Contribution | null>(null);
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function review(id: string, action: "approve" | "reject") {
    setError(null);
    setLoadingId(id);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.functions.invoke("admin_review_contribution", {
        body: { contribution_id: id, action },
      });
      if (err) {
        setError(err.message || "Action failed");
        setLoadingId(null);
        return;
      }
      setItems((prev) => {
        const found = prev.pending.find((r) => r.id === id);
        return {
          pending: prev.pending.filter((r) => r.id !== id),
          rejected:
            action === "reject" && found
              ? [{ ...found, status: "rejected" as const }, ...prev.rejected]
              : prev.rejected,
        };
      });
      setEditing(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setLoadingId(null);
    }
  }

  async function saveEdit(updates: Partial<Contribution>) {
    if (!editing) return;
    setError(null);
    setLoadingId(editing.id);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.functions.invoke("admin_review_contribution", {
        body: {
          contribution_id: editing.id,
          action: "edit",
          ...updates,
        },
      });
      if (err) {
        setError(err.message || "Update failed");
        setLoadingId(null);
        return;
      }
      setItems((prev) => ({
        pending: prev.pending.map((r) => (r.id === editing.id ? { ...r, ...updates } : r)),
        rejected: prev.rejected.map((r) => (r.id === editing.id ? { ...r, ...updates } : r)),
      }));
      setEditing(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Moderation
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            Back to Home
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            Sign out
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </p>
      )}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Pending ({items.pending.length})
        </h2>
        <ul className="mt-4 space-y-4">
          {items.pending.length === 0 && (
            <li className="text-sm text-[var(--foreground-muted)]">
              No pending submissions.
            </li>
          )}
          {items.pending.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl border border-[var(--border-default)] bg-[var(--card-background)] p-4"
            >
              {editing?.id === c.id ? (
                <AdminEditForm
                  contribution={c}
                  onSave={saveEdit}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <>
                  <h3 className="font-medium text-[var(--foreground)]">
                    {c.title}
                  </h3>
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-blue-400 hover:underline"
                  >
                    {c.link}
                  </a>
                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    {c.category}
                    {c.attribution_type !== "anonymous" && ` · ${c.attribution_value}`}
                  </p>
                  {c.description && (
                    <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                      {c.description}
                    </p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => review(c.id, "approve")}
                      disabled={loadingId === c.id}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {loadingId === c.id ? "…" : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => review(c.id, "reject")}
                      disabled={loadingId === c.id}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(c)}
                      disabled={loadingId === c.id}
                      className="rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Rejected ({items.rejected.length})
        </h2>
        <ul className="mt-4 space-y-4">
          {items.rejected.length === 0 && (
            <li className="text-sm text-[var(--foreground-muted)]">
              No rejected submissions.
            </li>
          )}
          {items.rejected.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl border border-[var(--border-default)] bg-[var(--background-secondary)] p-4"
            >
              {editing?.id === c.id ? (
                <AdminEditForm
                  contribution={c}
                  onSave={saveEdit}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <>
                  <h3 className="font-medium text-[var(--foreground)]">
                    {c.title}
                  </h3>
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-blue-400 hover:underline"
                  >
                    {c.link}
                  </a>
                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    {c.category}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => review(c.id, "approve")}
                      disabled={loadingId === c.id}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {loadingId === c.id ? "…" : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(c)}
                      disabled={loadingId === c.id}
                      className="rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function AdminEditForm({
  contribution,
  onSave,
  onCancel,
}: {
  contribution: Contribution;
  onSave: (u: Partial<Contribution>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(contribution.title);
  const [link, setLink] = useState(contribution.link);
  const [description, setDescription] = useState(contribution.description ?? "");
  const [category, setCategory] = useState(contribution.category);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ title, link, description: description || null, category });
      }}
      className="space-y-3"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-placeholder)]"
      />
      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Link"
        type="url"
        className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-placeholder)]"
      />
      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-placeholder)]"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={2}
        className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-placeholder)]"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
