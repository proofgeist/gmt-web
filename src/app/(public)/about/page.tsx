import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Button,
  Box,
  Image,
  Stack,
  Center,
  CardSection,
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
  IconInfoCircle,
} from "@tabler/icons-react";
import { brandColor } from "@/config/theme/mantine-theme";
import { ContactButton } from "./contact-button";

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
    <Container size="lg" py="xl">
      <Card shadow="md" radius="md" padding="xl" withBorder>
        <CardSection>
          <div style={{ position: "relative" }}>
            <Image
              src="/about-photo.jpg"
              alt="Global Marine Transportation"
              height={400}
              fit="cover"
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                width: "100%",
                padding: "0 2rem",
              }}
            >
              <Center mb="lg">
                <div className={styles.serviceIcon}>
                  <IconInfoCircle
                    size={60}
                    stroke={1.5}
                    color={brandColor[7]}
                  />
                </div>
              </Center>
              <Title ta="center" c="white" size="h1" mb="sm">
                About Global Marine Transportation
              </Title>
              <Text ta="center" c="white" size="xl" maw={800} mx="auto">
                Your trusted partner in global logistics, delivering reliable
                shipping solutions since 1995.
              </Text>
            </div>
          </div>
        </CardSection>

        <Stack gap="xl" mt="xl">
          <Text size="lg" lh={1.7}>
            Global Marine Transportation Inc. is a leading provider of
            international shipping and logistics services, connecting businesses
            to markets worldwide through our comprehensive network of
            transportation solutions. With decades of experience in the
            industry, we&apos;ve built a reputation for reliability, efficiency,
            and customer-focused service.
          </Text>

          <Text size="lg" lh={1.7}>
            Our team of logistics experts works tirelessly to optimize your
            supply chain, reduce costs, and ensure your cargo reaches its
            destination safely and on time. We combine industry knowledge with
            cutting-edge technology to provide transparent, efficient, and
            sustainable shipping solutions for businesses of all sizes.
          </Text>
        </Stack>

        <Title order={2} size="h2" mt="xl" mb="lg">
          Our Services
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {services.map((service, index) => {
            const ServiceIcon = service.icon;
            return (
              <Link
                href={`/about/${service.slug}`}
                key={index}
                style={{ textDecoration: "none" }}
                prefetch={true}
              >
                <Card
                  padding="lg"
                  radius="md"
                  withBorder
                  shadow="sm"
                  h="100%"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <ServiceIcon
                    size={40}
                    color={brandColor[7]}
                    style={{ marginBottom: "1rem" }}
                  />
                  <Text fw={600} size="lg" mb="xs">
                    {service.title}
                  </Text>
                  <Text size="md" c="dimmed" mb="xl">
                    {service.description}
                  </Text>
                  <div style={{ marginTop: "auto" }}>
                    <Button variant="light" color="blue" fullWidth>
                      Learn More
                    </Button>
                  </div>
                </Card>
              </Link>
            );
          })}
        </SimpleGrid>

        <CardSection mt="xl" inheritPadding py="xl">
          <Box
            style={{
              backgroundColor: "#f8f9fa",
              padding: "2rem",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <Title order={2} size="h2" mb="md">
              Ready to Ship with Us?
            </Title>
            <Text size="lg" maw={700} mx="auto" mb="xl">
              Contact our team today to discuss your shipping needs and discover
              how Global Marine Transportation can optimize your logistics
              operations.
            </Text>
            <ContactButton />
          </Box>
        </CardSection>
      </Card>
    </Container>
  );
}
