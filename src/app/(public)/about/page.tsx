import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Group,
  Button,
  Box,
} from "@mantine/core";
import styles from "./about.module.css";
import React from "react";
import Link from "next/link";
import {
  IconShip,
  IconGlobe,
  IconTruck,
  IconWorld,
  IconPackage,
} from "@tabler/icons-react";

const services = [
  {
    title: "Ocean Freight",
    description:
      "Maritime shipping solutions with competitive rates and flexible scheduling across major global routes.",
    icon: IconShip,
    slug: "ocean-freight",
  },
  {
    title: "Global Network",
    description:
      "Extensive network of partners worldwide ensuring seamless logistics operations.",
    icon: IconGlobe,
    slug: "global-network",
  },
  {
    title: "Land Transport",
    description:
      "Comprehensive inland transportation with door-to-door delivery and real-time tracking.",
    icon: IconTruck,
    slug: "land-transport",
  },
  {
    title: "Worldwide Service",
    description:
      "24/7 customer support across multiple time zones for reliable cargo delivery.",
    icon: IconWorld,
    slug: "worldwide-service",
  },
  {
    title: "Custom Solutions",
    description:
      "Tailored logistics solutions for specialized cargo and unique routing requirements.",
    icon: IconPackage,
    slug: "custom-solutions",
  },
];

export default function About() {
  return (
    <Container className={styles.aboutContainer}>
      <div className={styles.pageHeader}>
        <Title className={styles.pageTitle}>
          About Global Marine Transportation
        </Title>
        <Text className={styles.pageSubtitle}>
          Your trusted partner in global logistics, delivering reliable shipping
          solutions since 1995.
        </Text>
      </div>

      <Text className={styles.paragraph}>
        Global Marine Transportation Inc. is a leading provider of international
        shipping and logistics services, connecting businesses to markets
        worldwide through our comprehensive network of transportation solutions.
        With decades of experience in the industry, we&apos;ve built a
        reputation for reliability, efficiency, and customer-focused service.
      </Text>

      <Text className={styles.paragraph}>
        Our team of logistics experts works tirelessly to optimize your supply
        chain, reduce costs, and ensure your cargo reaches its destination
        safely and on time. We combine industry knowledge with cutting-edge
        technology to provide transparent, efficient, and sustainable shipping
        solutions for businesses of all sizes.
      </Text>

      <Title className={styles.sectionTitle}>Our Services</Title>

      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }}
        className={styles.featureGrid}
      >
        {services.map((service, index) => {
          const ServiceIcon = service.icon;
          return (
            <Link
              href={`/about/${service.slug}`}
              key={index}
              style={{ textDecoration: "none", height: "100%" }}
            >
              <Card className={styles.featureCard} style={{ height: "100%" }}>
                <ServiceIcon size={40} className={styles.featureIcon} />
                <Text className={styles.featureTitle}>{service.title}</Text>
                <Text size="sm" color="dimmed" mb="md">
                  {service.description}
                </Text>
                <Button variant="light" color="blue" fullWidth>
                  Learn More
                </Button>
              </Card>
            </Link>
          );
        })}
      </SimpleGrid>

      <Box className={styles.ctaSection}>
        <Title className={styles.ctaTitle}>Ready to Ship with Us?</Title>
        <Text className={styles.ctaText}>
          Contact our team today to discuss your shipping needs and discover how
          Global Marine Transportation can optimize your logistics operations.
        </Text>
        <Link href="/contact" passHref>
          <Button size="lg" color="blue">
            Contact Us
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
