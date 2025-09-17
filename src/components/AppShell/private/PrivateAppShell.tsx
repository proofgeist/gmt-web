import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import React from "react";
import { Footer } from "@/components/AppShell/internal/Footer";
import { headerHeight } from "../internal/config";
import { PrivateHeader } from "./PrivateHeader";
import { getCurrentSession } from "@/server/auth/utils/session";

export default async function PrivateAppShell({
  children,
}: {
  children: React.ReactNode;
  }) {
  const session = await getCurrentSession();
  
  return (
    <AppShell header={{ height: headerHeight }} padding="md">
      <AppShellHeader withBorder={false} bg="transparent">
        <PrivateHeader initialSession={session} />
      </AppShellHeader>

      <AppShellMain>{children}</AppShellMain>
      <Footer />
    </AppShell>
  );
}
