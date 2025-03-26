import {
  Container,
  Title,
  Text,
  Card,
  Button,
  Box,
  Image,
  Stack,
  Center,
  CardSection,
  Grid,
  GridCol,
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
  IconShield,
} from "@tabler/icons-react";
import { brandColor } from "@/config/theme/mantine-theme";
import { ContactButton } from "./contact-button";

const services = [
  {
    title: "Ocean Transportation",
    description:
      "World-class customer service with comprehensive shipping solutions and competitive rates.",
    icon: IconShip,
    slug: "ocean-transportation",
  },
  {
    title: "Inland Transportation",
    description:
      "Comprehensive door-to-door domestic and international freight services via road and rail.",
    icon: IconTruck,
    slug: "inland-transportation",
  },
  {
    title: "Fumigation",
    description:
      "Professional container fumigation services to prevent quarantined pests and ensure compliance.",
    icon: IconGlobe,
    slug: "fumigation",
  },
  {
    title: "Cargo Insurance",
    description:
      "Protect your shipments with comprehensive cargo insurance for all modes of transport.",
    icon: IconShield,
    slug: "cargo-insurance",
  },
  {
    title: "Customs Brokerage",
    description:
      "Expert customs clearance services ensuring smooth movement through US ocean ports.",
    icon: IconWorld,
    slug: "customs-brokerage",
  },
  {
    title: "Container Sizes",
    description:
      "Comprehensive guide to shipping container dimensions and specifications.",
    icon: IconPackage,
    slug: "container-sizes",
  },
  {
    title: "Sustainability",
    description:
      "Committed to environmental responsibility and sustainable shipping practices.",
    icon: IconGlobe,
    slug: "sustainability",
  },
];

export default function About() {
  return (
    <Container size="lg" py="xl">
      <Card shadow="md" radius="md" padding="xl" withBorder>
        <CardSection>
          <div style={{ position: "relative" }}>
            <Image
              src="/ship-image-2.jpg"
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
                Growth to Meet Global Challenges
              </Title>
              <Text ta="center" c="white" size="xl" maw={800} px="md" mx="auto">
                Your one-stop logistics service provider specializing in
                shipping, innovative and cost-effective solutions.
              </Text>
            </div>
          </div>
        </CardSection>

        <Stack gap="xl" mt="xl">
          <Text size="lg" lh={1.7}>
            Global Marine Transportation is your one-stop logistics service
            provider specializing in shipping, innovative and cost-effective
            solutions for each client, large or small. We shaped our evolution
            around the needs of our clients offering customized transportation
            services that distinguish us from competitors.
          </Text>

          <Text size="lg" lh={1.7}>
            GMT has become a market leader thanks to our engaging enthusiasm. We
            are a constantly evolving project; with forward-thinking strategies
            and innovative service offerings, our network has grown into an
            extraordinary global structure with worldwide operations allowing us
            to deliver amazing customer service for our clients.
          </Text>

          <Text size="lg" fw={500} lh={1.7} c={brandColor[7]}>
            With unrivaled global expertise, we make the impossible possible.
          </Text>
        </Stack>

        <Title order={2} size="h2" mt="xl" mb="lg">
          Our Services
        </Title>

        <Grid grow gutter="lg">
          {services.map((service, index) => {
            const ServiceIcon = service.icon;
            return (
              <GridCol span={{ base: 12, sm: 6, md: 4 }} key={index}>
                <Link
                  href={`/about/${service.slug}`}
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
                      <Button variant="light" color="brand.6" fullWidth>
                        Learn More
                      </Button>
                    </div>
                  </Card>
                </Link>
              </GridCol>
            );
          })}
        </Grid>

        <CardSection mt="xl" inheritPadding py="xl">
          <Box
            style={{
              backgroundColor: "#f8f9fa",
              padding: "2rem",
              borderRadius: "8px",
              position: "relative",
              overflow: "hidden",
              minHeight: "500px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url("/customer-service-image-1.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "top",
                opacity: 0.25,
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
              }}
            >
              <Title order={2} size="h2" mb="md" ta="center">
                Ready to Ship with Us?
              </Title>
              <Text size="lg" maw={700} mx="auto" mb="xl" ta="center">
                Contact our team today to discuss your shipping needs and
                discover how Global Marine Transportation can optimize your
                logistics operations.
              </Text>
              <ContactButton />
            </div>
          </Box>
        </CardSection>
      </Card>
    </Container>
  );
}
