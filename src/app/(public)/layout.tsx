
import { PublicAppShell } from "@/components/AppShell/AppShell";
import React from "react";
import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PublicAppShell>{children}</PublicAppShell>
      </div>
    </div>
  );
}
