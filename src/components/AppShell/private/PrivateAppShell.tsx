import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import React from "react";
import { Footer } from "@/components/AppShell/internal/Footer";
import { headerHeight } from "../internal/config";
import { PrivateHeader } from "./PrivateHeader";

export default function PrivateAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell header={{ height: headerHeight }} padding="md">
      <AppShellHeader withBorder={false} bg="transparent">
        <PrivateHeader />
      </AppShellHeader>

      <AppShellMain>{children}</AppShellMain>
      <Footer />
    </AppShell>
  );
}
