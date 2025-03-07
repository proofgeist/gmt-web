import { PublicAppShell } from "@/components/AppShell/AppShell";
import React from "react";
import styles from "./layout.module.css";
import Image from "next/image";
import { Box } from "@mantine/core";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Box className={styles.backgroundWrapper}>
        <Image
          src="/home image-2-blue-smaller.jpeg"
          alt="Global Marine Transportation Background"
          fill
          priority
          quality={100}
          className={styles.backgroundImage}
        />
      </Box>
      <PublicAppShell>{children}</PublicAppShell>
    </>
  );
}
