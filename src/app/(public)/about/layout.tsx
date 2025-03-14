"use client";

import React from "react";
import styles from "./about.module.css";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={styles.darkOverlay}></div>
      {children}
    </>
  );
}
