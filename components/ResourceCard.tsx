import type { Contribution } from "@/types/database";

const ATTRIBUTION_ICONS: Record<string, string> = {
  x: "𝕏",
  instagram: "📷",
  linkedin: "in",
  github: "⌃",
};

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
      className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
    >
      {resource.preview_image_url && (
        <div className="mb-3 aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <img
            src={resource.preview_image_url}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        </div>
      )}
      <h3 className="font-semibold text-neutral-900 dark:text-white">
        {resource.title}
      </h3>
      <span className="mt-1 inline-block text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {resource.category}
      </span>
      {resource.description && (
        <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
          {resource.description}
        </p>
      )}
      <p className="mt-auto pt-3 text-xs text-neutral-500 dark:text-neutral-400">
        {isAnonymous ? (
          "Anonymous"
        ) : (
          <span className="inline-flex items-center gap-1">
            <span aria-hidden>
              {ATTRIBUTION_ICONS[resource.attribution_type] || "•"}
            </span>
            {attributionLabel}
          </span>
        )}
      </p>
    </a>
  );
}
