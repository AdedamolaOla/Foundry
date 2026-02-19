"use client";

import { useState, useCallback, useEffect } from "react";
import type { AttributionType } from "@/types/database";

const ATTRIBUTION_OPTIONS: { value: AttributionType; label: string }[] = [
  { value: "anonymous", label: "Anonymous" },
  { value: "x", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
];

interface ContributeModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContributeModal({ open, onClose }: ContributeModalProps) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [attributionType, setAttributionType] = useState<AttributionType>("anonymous");
  const [attributionValue, setAttributionValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const resetForm = useCallback(() => {
    setTitle("");
    setLink("");
    setDescription("");
    setCategory("");
    setAttributionType("anonymous");
    setAttributionValue("");
    setMessage(null);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const trimmedTitle = title.trim();
    const trimmedLink = link.trim();
    const trimmedCategory = category.trim();
    if (!trimmedTitle) {
      setMessage({ type: "error", text: "Resource title is required." });
      return;
    }
    if (!trimmedLink) {
      setMessage({ type: "error", text: "Resource link is required." });
      return;
    }
    try {
      new URL(trimmedLink);
    } catch {
      setMessage({ type: "error", text: "Please enter a valid URL." });
      return;
    }
    if (!trimmedCategory) {
      setMessage({ type: "error", text: "Category is required." });
      return;
    }
    if (attributionType !== "anonymous" && !attributionValue.trim()) {
      setMessage({ type: "error", text: "Please enter your handle or profile URL for attribution." });
      return;
    }

    setSubmitting(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !anonKey) {
        setMessage({ type: "error", text: "Configuration error. Please try again later." });
        setSubmitting(false);
        return;
      }
      const res = await fetch(`${supabaseUrl}/functions/v1/submit_contribution`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonKey}` },
        body: JSON.stringify({
          title: trimmedTitle,
          link: trimmedLink,
          description: description.trim() || null,
          category: trimmedCategory,
          attribution_type: attributionType,
          attribution_value: attributionType === "anonymous" ? null : attributionValue.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({
          type: "error",
          text: (data?.error as string) || "Submission failed. Please try again.",
        });
        setSubmitting(false);
        return;
      }
      setMessage({ type: "success", text: "Thanks! Your submission is pending review." });
      resetForm();
      setTimeout(handleClose, 2000);
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contribute-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <h2 id="contribute-title" className="text-lg font-semibold text-neutral-900 dark:text-white">
          Contribute a resource
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="contribute-title-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Resource Title *
            </label>
            <input
              id="contribute-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              placeholder="e.g. Figma Community"
            />
          </div>
          <div>
            <label htmlFor="contribute-link" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Resource Link (URL) *
            </label>
            <input
              id="contribute-link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              placeholder="https://..."
            />
          </div>
          <div>
            <label htmlFor="contribute-category" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Category *
            </label>
            <input
              id="contribute-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              list="categories-list"
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              placeholder="e.g. UI Kits"
            />
          </div>
          <div>
            <label htmlFor="contribute-description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Description (optional)
            </label>
            <textarea
              id="contribute-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              placeholder="Brief description..."
            />
          </div>
          <div>
            <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Attribution (choose one)
            </span>
            <div className="mt-2 space-y-2">
              {ATTRIBUTION_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="attribution"
                    value={opt.value}
                    checked={attributionType === opt.value}
                    onChange={() => {
                      setAttributionType(opt.value);
                      if (opt.value === "anonymous") setAttributionValue("");
                    }}
                    className="rounded-full border-neutral-300 text-neutral-900 focus:ring-neutral-500"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{opt.label}</span>
                </label>
              ))}
            </div>
            {attributionType !== "anonymous" && (
              <input
                type="text"
                value={attributionValue}
                onChange={(e) => setAttributionValue(e.target.value)}
                placeholder="Handle or profile URL"
                className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            )}
          </div>
          {message && (
            <p
              className={`text-sm ${
                message.type === "success"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {message.text}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
