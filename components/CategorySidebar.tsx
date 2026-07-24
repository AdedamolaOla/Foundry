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
    <aside className="w-full shrink-0 lg:w-[160px]">
      <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
        <h2 className="hidden px-4 py-2 text-[18px] font-bold text-[var(--foreground)] lg:block">
          Categories
        </h2>
        {/* Mobile / tablet: horizontal scrolling chip row, bled edge-to-edge past the page padding. Desktop: vertical list (matches Figma). */}
        <nav className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:px-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition lg:w-full lg:rounded-lg lg:border-0 lg:text-left ${
              selectedCategory === null
                ? "border-transparent bg-[var(--foreground)] text-[var(--primary-foreground)] lg:bg-white/10 lg:text-[var(--foreground)]"
                : "border-[var(--border-default)] bg-[var(--card-background)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] lg:bg-transparent lg:hover:bg-white/5"
            }`}
          >
            <span className="flex items-center justify-between gap-2">
              All
              <span className="text-xs text-[var(--foreground-muted)]">{totalCount}</span>
            </span>
          </button>
          {categories.map(({ name, count }) => (
            <button
              key={name}
              type="button"
              onClick={() => onSelectCategory(name)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition lg:w-full lg:rounded-lg lg:border-0 lg:text-left ${
                selectedCategory === name
                  ? "border-transparent bg-[var(--foreground)] text-[var(--primary-foreground)] lg:bg-white/10 lg:text-[var(--foreground)]"
                  : "border-[var(--border-default)] bg-[var(--card-background)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] lg:bg-transparent lg:hover:bg-white/5"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                {name}
                <span className="text-xs text-[var(--foreground-muted)]">{count}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
