import AppShell from "@/components/AppShell/internal/AppShell";
import React from "react";
import Protect from "@/components/auth/protect";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Protect>
      <AppShell>{children}</AppShell>
    </Protect>
  );
}
