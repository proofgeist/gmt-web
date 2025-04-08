"use client";

import { PublicAppShell } from "@/components/AppShell/AppShell";
import React, { useEffect, useState } from "react";
import styles from "./layout.module.css";

// Define the background images to cycle through
const backgroundImages = [
  "/customer-service-image-7.jpg",
  "/ship-image-9.jpg",
  "/ship-image-10.jpg",
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
    }, 5000);

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
