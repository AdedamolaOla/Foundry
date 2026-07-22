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

  const fieldClassName =
    "w-full rounded-lg border border-[var(--border-default)] bg-[var(--input-background)] px-4 py-2.5 text-base leading-6 text-[var(--foreground)] placeholder:text-[var(--foreground-placeholder)] outline-none transition-colors focus:border-[var(--foreground-muted)]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contribute-title"
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col gap-6 overflow-y-auto rounded-[28px] bg-[var(--background-secondary)] p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col gap-2">
          <h2 id="contribute-title" className="text-lg font-bold text-[var(--foreground)]">
            Contribute a resource
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            Enter the details of the resource you want to add
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="contribute-title-input" className="sr-only">
                Resource Title (required)
              </label>
              <input
                id="contribute-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={fieldClassName}
                placeholder="Resource title"
              />
            </div>
            <div>
              <label htmlFor="contribute-link" className="sr-only">
                Resource Link (required)
              </label>
              <input
                id="contribute-link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
                className={fieldClassName}
                placeholder="Link to the resource"
              />
            </div>
            <div>
              <label htmlFor="contribute-category" className="sr-only">
                Category (required)
              </label>
              <input
                id="contribute-category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                list="categories-list"
                className={fieldClassName}
                placeholder="Category"
              />
            </div>
            <div>
              <label htmlFor="contribute-description" className="sr-only">
                Description (optional)
              </label>
              <textarea
                id="contribute-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`${fieldClassName} min-h-[95px] resize-none`}
                placeholder="Description"
              />
              <p className="mt-1.5 text-sm text-[var(--foreground-placeholder)]">Optional</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-[var(--foreground)]">
              Attribution
            </span>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Attribution">
              {ATTRIBUTION_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    attributionType === opt.value
                      ? "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "border-[var(--border-default)] bg-[var(--input-background)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="attribution"
                    value={opt.value}
                    checked={attributionType === opt.value}
                    onChange={() => {
                      setAttributionType(opt.value);
                      if (opt.value === "anonymous") setAttributionValue("");
                    }}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {attributionType !== "anonymous" && (
              <input
                type="text"
                value={attributionValue}
                onChange={(e) => setAttributionValue(e.target.value)}
                placeholder="Handle or profile URL"
                className={fieldClassName}
              />
            )}
          </div>
          {message && (
            <p
              className={`text-sm ${
                message.type === "success"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message.text}
            </p>
          )}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-[var(--border-default)] px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
