import type { Contribution } from "@/types/database";

const ATTRIBUTION_ICONS: Record<string, string> = {
  x: "𝕏",
  instagram: "📷",
  linkedin: "in",
  github: "⌃",
};

// Deterministic, purely decorative gradients used as a placeholder thumbnail
// when a contribution has no preview image. Real resource imagery comes from
// user submissions via Supabase, not from Figma assets.
const PLACEHOLDER_GRADIENTS = [
  "from-[#feffe8] via-[#f7d9a0] to-[#f2a65a]",
  "from-[#3b82f6] via-[#6366f1] to-[#a855f7]",
  "from-[#f59e0b] via-[#f43f5e] to-[#ec4899]",
  "from-[#22d3ee] via-[#3b82f6] to-[#1e3a8a]",
  "from-[#84cc16] via-[#22c55e] to-[#14b8a6]",
  "from-[#f97316] via-[#ef4444] to-[#a21caf]",
];

function pickGradient(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PLACEHOLDER_GRADIENTS[hash % PLACEHOLDER_GRADIENTS.length];
}

export function ResourceCard({ resource }: { resource: Contribution }) {
  const isAnonymous = resource.attribution_type === "anonymous";
  const attributionLabel = isAnonymous
    ? "Anonymous"
    : resource.attribution_value || resource.attribution_type;

  return (
    <a
      href={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col gap-4 overflow-hidden rounded-[32px] bg-[var(--card-background)] p-6 transition hover:bg-white/[0.03]"
    >
      <div className="relative h-[146px] w-full shrink-0 overflow-hidden rounded-[16px]">
        {resource.preview_image_url ? (
          <img
            src={resource.preview_image_url}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${pickGradient(
              resource.id
            )}`}
          />
        )}
        <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur">
          {resource.category}
        </span>
      </div>

      <div className="flex flex-col gap-[10px]">
        <h3 className="line-clamp-2 text-[20px] font-semibold leading-6 text-[var(--foreground)]">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="line-clamp-3 text-[16px] leading-[1.2] text-[var(--foreground-muted)]">
            {resource.description}
          </p>
        )}
      </div>

      <div className="mt-auto flex items-center gap-2 pt-1 text-[14px] text-[var(--foreground-muted)]">
        {isAnonymous ? (
          <span>Anonymous</span>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="text-[13px]">
              {ATTRIBUTION_ICONS[resource.attribution_type] || "•"}
            </span>
            {attributionLabel}
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_4px_19.5px_2px_rgba(255,255,255,0.04)]" />
    </a>
  );
}
