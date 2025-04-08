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
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <Box>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          {/* <Title className={styles.mainTitle}>
            GLOBAL MARINE
            <br />
            TRANSPORTATION INC.
          </Title> */}
          <Title order={2} className={styles.tagline}>
            Your Trusted Shipping Partner for a Connected World
          </Title>
        </div>

        <Container size="xl" className={styles.cardsContainer}>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} spacing="lg">
            {serviceCards.map((service, index) => (
              <Link
                href={`/about/${service.slug}`}
                key={index}
                style={{ textDecoration: "none", height: "100%" }}
                prefetch={true}
              >
                <Card className={styles.glassCard} style={{ height: "100%" }}>
                  <Group wrap="nowrap" mb="sm">
                    <service.icon size={40} stroke={1.5} color="#fff" />
                    <Text c="white" fw={500} style={{ flexShrink: 1 }}>
                      {service.title}
                    </Text>
                  </Group>
                  <Text size="sm" c="white" opacity={0.8}>
                    {service.description}
                  </Text>
                </Card>
              </Link>
            ))}
          </SimpleGrid>
        </Container>
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
