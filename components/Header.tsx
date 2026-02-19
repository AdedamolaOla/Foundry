import Link from "next/link";

interface HeaderProps {
  onContributeClick?: () => void;
  showAdminLink?: boolean;
}

export function Header({ onContributeClick, showAdminLink = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-semibold text-neutral-900 dark:text-white">
          Design in a Box
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            About
          </Link>
          {showAdminLink && (
            <Link
              href="/admin"
              className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Admin
            </Link>
          )}
          <button
            type="button"
            onClick={onContributeClick}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Contribute
          </button>
        </nav>
      </div>
    </header>
  );
}
