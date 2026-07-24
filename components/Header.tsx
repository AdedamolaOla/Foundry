"use client";

import Link from "next/link";
import { useSearch } from "./SearchContext";
import { SearchBar } from "./SearchBar";

interface HeaderProps {
  onContributeClick?: () => void;
  showAdminLink?: boolean;
  resourceCount?: number;
}

function ResourceCountIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-[18px]"
      aria-hidden
    >
      <rect x="4" y="3" width="13" height="16" rx="2" />
      <path d="M8 8h5M8 12h5M8 16h3" strokeLinecap="round" />
    </svg>
  );
}

export function Header({ onContributeClick, showAdminLink = false, resourceCount = 0 }: HeaderProps) {
  const { searchQuery, setSearchQuery } = useSearch();
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-10 lg:flex-nowrap lg:justify-normal lg:gap-0 lg:px-20 lg:py-8">
        <div className="flex items-center gap-2 sm:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-8 shrink-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #f97316 0%, #eab308 14%, #22c55e 38%, #06b6d4 62%, #3b82f6 82%, #f97316 100%)",
              }}
            />
            <span className="text-base font-bold text-[var(--foreground)]">Foundry</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/about"
              className="rounded-md px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-white/5 sm:px-4"
            >
              About
            </Link>
            {showAdminLink && (
              <Link
                href="/admin"
                className="rounded-md px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-white/5 sm:px-4"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
        <button
          type="button"
          onClick={onContributeClick}
          className="shrink-0 rounded-[10px] bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition hover:opacity-90 lg:hidden"
        >
          Contribute
        </button>
        <div className="order-3 w-full lg:order-none lg:ml-auto lg:mr-[24px] lg:w-[319px]">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="hidden shrink-0 items-center gap-2 border-x border-[var(--border-default)] px-6 py-2.5 lg:mr-[24px] lg:flex">
          <ResourceCountIcon />
          <span className="whitespace-nowrap text-base text-[var(--foreground-placeholder)]">
            {resourceCount.toLocaleString()}
          </span>
        </div>
        <button
          type="button"
          onClick={onContributeClick}
          className="hidden shrink-0 rounded-[10px] bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition hover:opacity-90 lg:block"
        >
          Contribute
        </button>
      </div>
    </header>
  );
}
