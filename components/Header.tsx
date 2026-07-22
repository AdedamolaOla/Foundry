import Link from "next/link";

interface HeaderProps {
  onContributeClick?: () => void;
  showAdminLink?: boolean;
}

function LogoMark() {
  return (
    <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[8px] bg-[#292929]">
      <span className="flex flex-col items-center gap-[3px]">
        <span className="h-[4px] w-[18px] rounded-[3px] bg-white" />
        <span className="h-[4px] w-[14px] rounded-[3px] bg-white/24" />
      </span>
    </span>
  );
}

export function Header({ onContributeClick, showAdminLink = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-4 sm:px-10 lg:px-20 lg:py-8">
        <div className="flex items-center gap-2 sm:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
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
          className="shrink-0 rounded-[10px] bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition hover:opacity-90"
        >
          Contribute
        </button>
      </div>
    </header>
  );
}
