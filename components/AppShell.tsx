"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ContributeModal } from "./ContributeModal";
import { SearchProvider } from "./SearchContext";

export function AppShell({
  children,
  showAdminLink = false,
  resourceCount = 0,
}: {
  children: React.ReactNode;
  showAdminLink?: boolean;
  resourceCount?: number;
}) {
  const [contributeOpen, setContributeOpen] = useState(false);
  return (
    <SearchProvider>
      <Header
        onContributeClick={() => setContributeOpen(true)}
        showAdminLink={showAdminLink}
        resourceCount={resourceCount}
      />
      <main>{children}</main>
      <Footer />
      <ContributeModal
        open={contributeOpen}
        onClose={() => setContributeOpen(false)}
      />
    </SearchProvider>
  );
}
