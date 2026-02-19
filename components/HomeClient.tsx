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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      <div className="flex gap-8">
        <CategorySidebar
          categories={categoriesWithCount}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          totalCount={initialResources.length}
        />
        <div className="min-w-0 flex-1">
          <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
            {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-neutral-500 dark:text-neutral-400">
              No resources match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
