"use client";

import {
  Container,
  Text,
  Title,
  SimpleGrid,
  Card,
  Group,
  Box,
} from "@mantine/core";
import styles from "./page.module.css";
import {
  IconShip,
  IconGlobe,
  IconTruck,
  IconWorld,
  IconShield,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";

// Define the background images to cycle through
const backgroundImages = [
  "/customer-service-image-7.jpg",
  "/ship-image-9.jpg",
  "/ship-image-10.jpg",
];

export default function Home() {
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
    <Box>
      <div className={styles.heroContainer}>
        <div className={styles.heroSection}>
          {/* Background images */}
          {encodedImages.map((src, index) => (
            <div
              key={src}
              className={`${styles.backgroundImage} ${
                index === currentImageIndex ? styles.active : ""
              }`}
              style={{
                backgroundImage: `url(${src})`,
              }}
            />
          ))}

          <div className={styles.heroContent}>
            <Title order={2} className={styles.tagline}>
              Your Trusted Shipping Partner for a Connected World
            </Title>
          </div>
        </div>

        <div className={styles.cardsSection}>
          <Container size="xl" className={styles.cardsContainer}>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} spacing="lg">
              {serviceCards.map((service, index) => (
                <Link
                  href={`/about/${service.slug}`}
                  key={index}
                  style={{ textDecoration: "none", height: "100%" }}
                  prefetch={true}
                >
                  <Card
                    className={styles.card}
                    style={{ height: "100%" }}
                    withBorder
                  >
                    <Group wrap="nowrap" mb="sm">
                      <service.icon size={40} stroke={1.5} color="#1c2841" />
                      <Text fw={500} style={{ flexShrink: 1 }}>
                        {service.title}
                      </Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {service.description}
                    </Text>
                  </Card>
                </Link>
              ))}
            </SimpleGrid>
          </Container>
        </div>
      </div>
    </Box>
  );
}
const serviceCards = [
  {
    icon: IconShip,
    title: "Ocean Transportation",
    description:
      "World-class customer service with comprehensive shipping solutions and competitive rates.",
    slug: "ocean-transportation",
  },
  {
    icon: IconTruck,
    title: "Inland Transportation",
    description:
      "Comprehensive door-to-door domestic and international freight services via road and rail.",
    slug: "inland-transportation",
  },
  {
    icon: IconGlobe,
    title: "Fumigation",
    description:
      "Professional container fumigation services to prevent quarantined pests and ensure compliance.",
    slug: "fumigation",
  },
  {
    icon: IconShield,
    title: "Cargo Insurance",
    description:
      "Protect your shipments with comprehensive cargo insurance for all modes of transport.",
    slug: "cargo-insurance",
  },
  {
    icon: IconWorld,
    title: "Customs Brokerage",
    description:
      "Expert customs clearance services ensuring smooth movement through US ocean ports.",
    slug: "customs-brokerage",
  },
];
