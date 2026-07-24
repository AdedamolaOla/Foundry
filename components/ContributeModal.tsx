"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import * as Switch from "@radix-ui/react-switch";
import type { AttributionType } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-6.8L4.5 22H1.4l8.1-9.3L1 2h7.2l5 6.2L18.9 2zm-1.2 18h1.7L7.4 4H5.6l12.1 16z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M12 2C6.48 2 2 6.58 2 12.19c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49 0-.24-.01-1.03-.01-1.87-2.78.61-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 2.5-.34c.85 0 1.7.11 2.5.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.19C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

const PLATFORM_OPTIONS: {
  value: Exclude<AttributionType, "anonymous">;
  label: string;
  Icon: () => React.JSX.Element;
}[] = [
  { value: "x", label: "X (Twitter)", Icon: XIcon },
  { value: "instagram", label: "Instagram", Icon: InstagramIcon },
  { value: "linkedin", label: "LinkedIn", Icon: LinkedInIcon },
  { value: "github", label: "GitHub", Icon: GitHubIcon },
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
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const isAnonymous = attributionType === "anonymous";
  const lastPlatform = useRef<Exclude<AttributionType, "anonymous">>("x");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("contributions").select("category");
      if (cancelled || !data) return;
      const unique = Array.from(new Set(data.map((row) => row.category).filter(Boolean)));
      unique.sort((a, b) => a.localeCompare(b));
      setCategoryOptions(unique);
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

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
                autoComplete="off"
                className={fieldClassName}
                placeholder="Category"
              />
              <datalist id="categories-list">
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
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
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2">
                <Switch.Root
                  checked={isAnonymous}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      lastPlatform.current = attributionType !== "anonymous" ? attributionType : lastPlatform.current;
                      setAttributionType("anonymous");
                      setAttributionValue("");
                    } else {
                      setAttributionType(lastPlatform.current);
                    }
                  }}
                  className="relative h-6 w-11 shrink-0 rounded-full bg-[var(--border-default)] outline-none transition-colors data-[state=checked]:bg-green-500"
                >
                  <Switch.Thumb className="block size-5 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[22px]" />
                </Switch.Root>
                <span className="text-sm font-medium text-[var(--foreground)]">Keep anonymous</span>
              </label>
              {!isAnonymous && (
                <div className="flex items-center gap-2" role="radiogroup" aria-label="Platform">
                  {PLATFORM_OPTIONS.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={attributionType === value}
                      aria-label={label}
                      title={label}
                      onClick={() => setAttributionType(value)}
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        attributionType === value
                          ? "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "border-[var(--border-default)] bg-[var(--input-background)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <Icon />
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!isAnonymous && (
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
