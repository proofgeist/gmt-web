import {
  Container,
  Text,
  Title,
  SimpleGrid,
  Card,
  Group,
  Image,
} from "@mantine/core";
import styles from "./page.module.css";
import {
  IconShip,
  IconGlobe,
  IconTruck,
  IconWorld,
  IconPackage,
} from "@tabler/icons-react";
import React from "react";

export default function Home() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <Image
          src="/gmt_logo.png"
          alt="ProofKit"
          p={4}
          maw={84}
          height={84}
          radius={"md"}
          fit="contain"
        />
        <Title className={styles.mainTitle}>
          GLOBAL MARINE
          <br />
          TRANSPORTATION
        </Title>
        <Title order={2} className={styles.tagline}>
          Your Trusted Shipping Partner for a Connected World
        </Title>
      </div>

      <Container size="xl" className={styles.cardsContainer}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} spacing="lg">
          {serviceCards.map((service, index) => (
            <Card key={index} className={styles.glassCard}>
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
          ))}
        </SimpleGrid>
      </Container>
    </div>
  );
}
const serviceCards = [
  {
    icon: IconShip,
    title: "Ocean Freight",
    description:
      "Maritime shipping solutions with competitive rates and flexible scheduling across major global routes.",
  },
  {
    icon: IconGlobe,
    title: "Global Network",
    description:
      "Extensive network of partners worldwide ensuring seamless logistics operations.",
  },
  {
    icon: IconTruck,
    title: "Land Transport",
    description:
      "Comprehensive inland transportation with door-to-door delivery and real-time tracking.",
  },
  {
    icon: IconWorld,
    title: "Worldwide Service",
    description:
      "24/7 customer support across multiple time zones for reliable cargo delivery.",
  },
  {
    icon: IconPackage,
    title: "Custom Solutions",
    description:
      "Tailored logistics solutions for specialized cargo and unique routing requirements.",
  },
];
