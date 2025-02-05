import { Header } from "@/components/AppShell/internal/Header";
import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import React from "react";
import { Footer } from "@/components/AppShell/internal/Footer";
import { headerHeight } from "./config";

export default function MainAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell header={{ height: headerHeight }} padding="md">
      <AppShellHeader withBorder={false} bg="transparent">
        <Header />
      </AppShellHeader>

      <AppShellMain>{children}</AppShellMain>
      <Footer />
    </AppShell>
  );
}
