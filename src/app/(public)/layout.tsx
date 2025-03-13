"use client";

import { PublicAppShell } from "@/components/AppShell/AppShell";
import React, { useEffect, useState } from "react";
import styles from "./layout.module.css";

// Define the background images to cycle through
const backgroundImages = [
  "/home-image-1.jpg",
  "/home-image-2.jpg",
  "/home-image-3.jpg",
  "/home-image-4.jpg",
  "/home-image-5.jpg",
  "/home-image-6.jpg",
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Encode image URLs to handle spaces
  const encodedImages = backgroundImages.map((img) => encodeURI(img));

  // Change image every interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % encodedImages.length
      );
    }, 12000);

    return () => clearInterval(timer);
  }, [encodedImages]);

  return (
    <div className={styles.container}>
      {/* Background images */}
      {encodedImages.map((src, index) => (
        <div
          key={src}
          className={`${styles.backgroundImage} ${index === currentImageIndex ? styles.active : ""}`}
          style={{
            backgroundImage: `url(${src})`,
          }}
        />
      ))}

      {/* Content */}
      <div className={styles.content}>
        <PublicAppShell>{children}</PublicAppShell>
      </div>
    </div>
  );
}
