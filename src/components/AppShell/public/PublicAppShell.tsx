import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import React from "react";
import { Footer } from "@/components/AppShell/internal/Footer";
import { headerHeight } from "../internal/config";
import { PublicHeader } from "./PublicHeader";
import { getCurrentSession } from "@/server/auth/utils/session";

export default async function PublicAppShell({
  children,
}: {
  children: React.ReactNode;
  }) {
  const session = await getCurrentSession();
  
  return (
    <AppShell header={{ height: headerHeight }} >
      <AppShellHeader withBorder={false} bg="transparent">
        <PublicHeader initialSession={session} />
      </AppShellHeader>

      <AppShellMain>{children}</AppShellMain>
      <Footer />
    </AppShell>
  );
}
