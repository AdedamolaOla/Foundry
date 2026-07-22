import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[var(--background-secondary)] px-6 py-8 sm:px-10 lg:px-20">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4">
        <nav className="flex items-center gap-2">
          <Link
            href="/about"
            className="rounded-md px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-white/5"
          >
            About
          </Link>
        </nav>
        <p className="px-4 text-[10px] font-light text-[var(--foreground-muted)] lg:text-[12px]">
          Copyright {year} | All copyrights, logos, trademarks and intellectual properties in
          this website are property of their respective owner.
        </p>
      </div>
    </footer>
  );
}
