"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search resource",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[var(--foreground-placeholder)]"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[8px] border border-[var(--border-default)] bg-[var(--input-background)] py-[10px] pl-11 pr-4 text-[15px] text-[var(--foreground)] placeholder:text-[var(--foreground-placeholder)] outline-none transition focus:border-[var(--foreground-muted)]"
        aria-label="Search resources"
      />
    </div>
  );
}
