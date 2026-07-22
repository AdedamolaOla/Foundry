"use client";

import { useMemo, useState } from "react";
import type { Contribution } from "@/types/database";
import { CategorySidebar } from "./CategorySidebar";
import { ResourceCard } from "./ResourceCard";
import { SearchBar } from "./SearchBar";

interface HomeClientProps {
  initialResources: Contribution[];
}

export function HomeClient({ initialResources }: HomeClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const byCategory =
      selectedCategory == null
        ? initialResources
        : initialResources.filter((r) => r.category === selectedCategory);
    if (!q) return byCategory;
    return byCategory.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description?.toLowerCase().includes(q) ?? false) ||
        r.category.toLowerCase().includes(q)
    );
  }, [initialResources, searchQuery, selectedCategory]);

  const categoriesWithCount = useMemo(() => {
    const map = new Map<string, number>();
    initialResources.forEach((r) => {
      map.set(r.category, (map.get(r.category) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [initialResources]);

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-10 sm:px-10 lg:px-20 lg:py-20">
      {/* Hero */}
      <div className="flex flex-col gap-4">
        <h1 className="text-[28px] font-bold leading-tight text-[var(--foreground)] sm:text-[32px]">
          Foundry
        </h1>
        <p className="max-w-[751px] text-[16px] leading-[1.3] text-[var(--foreground-muted)] sm:text-[18px]">
          This collection of resources is here to help you on your design journey, offering
          insights and tips on all things UX and product design. Dive in, learn, and grow your
          skills.
        </p>
      </div>

      {/* Search */}
      <div className="mt-8 flex flex-col gap-3 lg:mt-10">
        <div className="max-w-full sm:max-w-[380px]">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        {searchQuery.trim() && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#292929] px-4 py-1.5 text-sm text-[var(--foreground-placeholder)]">
            <span>
              Showing results for:{" "}
              <span className="font-bold text-[var(--foreground)]">{searchQuery.trim()}</span>
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="text-[var(--foreground-muted)] transition hover:text-[var(--foreground)]"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-8 flex flex-col gap-6 lg:mt-[62px] lg:flex-row lg:items-start lg:gap-6">
        <div className="order-2 min-w-0 flex-1 lg:order-1">
          <p className="mb-4 text-sm text-[var(--foreground-muted)]">
            {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="py-16 text-center text-[var(--foreground-muted)]">
              No resources match your filters.
            </p>
          )}
        </div>
        <div className="order-1 lg:order-2">
          <CategorySidebar
            categories={categoriesWithCount}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            totalCount={initialResources.length}
          />
        </div>
      </div>
    </div>
  );
}
