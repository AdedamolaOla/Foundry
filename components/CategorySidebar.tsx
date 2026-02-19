"use client";

interface CategorySidebarProps {
  categories: { name: string; count: number }[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  totalCount: number;
}

export function CategorySidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  totalCount,
}: CategorySidebarProps) {
  return (
    <aside className="w-full shrink-0 lg:w-56">
      <div className="sticky top-20 space-y-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Categories
        </h2>
        {/* Mobile: horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`shrink-0 rounded-md px-3 py-2 text-sm transition lg:block lg:w-full lg:text-left ${
              selectedCategory === null
                ? "bg-neutral-200 font-medium text-neutral-900 dark:bg-neutral-700 dark:text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            }`}
          >
            All ({totalCount})
          </button>
          {categories.map(({ name, count }) => (
            <button
              key={name}
              type="button"
              onClick={() => onSelectCategory(name)}
              className={`shrink-0 rounded-md px-3 py-2 text-sm transition lg:block lg:w-full lg:text-left ${
                selectedCategory === name
                  ? "bg-neutral-200 font-medium text-neutral-900 dark:bg-neutral-700 dark:text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
              }`}
            >
              {name} ({count})
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
