"use client";

import Link from "next/link";
import { useSearch } from "./SearchContext";
import { SearchBar } from "./SearchBar";

interface HeaderProps {
  onContributeClick?: () => void;
  showAdminLink?: boolean;
}

export function Header({ onContributeClick, showAdminLink = false }: HeaderProps) {
  const { searchQuery, setSearchQuery } = useSearch();
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 px-6 py-4 sm:px-10 lg:flex-nowrap lg:gap-0 lg:px-20 lg:py-8">
        <div className="flex items-center gap-2 sm:gap-6">
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/foundry-logo.svg" alt="Foundry" className="h-9 w-auto" />
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
          <button
            type="button"
            onClick={onContributeClick}
            className="shrink-0 rounded-[10px] bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition hover:opacity-90 lg:hidden"
          >
            Contribute
          </button>
        </div>
        <div className="w-full lg:ml-auto lg:mr-[24px] lg:w-[319px]">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
