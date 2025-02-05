import AppShell from "@/components/AppShell/internal/AppShell";
import React from "react";
import styles from "./layout.module.css";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.backgroundWrapper}>
        <Image
          src="/home image-1.jpg"
          alt="Global Marine Transportation Background"
          fill
          priority
          quality={100}
          className={styles.backgroundImage}
        />
      </div>
      <AppShell>{children}</AppShell>
    </>
  );
}
