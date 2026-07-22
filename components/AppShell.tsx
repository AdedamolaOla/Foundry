"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ContributeModal } from "./ContributeModal";

export function AppShell({
  children,
  showAdminLink = false,
}: {
  children: React.ReactNode;
  showAdminLink?: boolean;
}) {
  const [contributeOpen, setContributeOpen] = useState(false);
  return (
    <>
      <Header
        onContributeClick={() => setContributeOpen(true)}
        showAdminLink={showAdminLink}
      />
      <main>{children}</main>
      <Footer />
      <ContributeModal
        open={contributeOpen}
        onClose={() => setContributeOpen(false)}
      />
    </>
  );
}
