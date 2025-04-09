"use client";

import { useMantineTheme } from "@mantine/core";
import { Box, Container, Title, Text, Card, SimpleGrid } from "@mantine/core";
import {
  IconShip,
  IconTruck,
  IconShieldCheck,
  IconBriefcase,
  IconPackage,
  IconBoxMultiple,
} from "@tabler/icons-react";

export default function Services() {
  const theme = useMantineTheme();
  return (
    <Box pt={"30px"}>
      <Container>
        <Title order={2} ta="center" style={{ marginBottom: "30px" }}>
          Our Services
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <IconShip size={40} color={theme.colors.brand[8]} />
            <Title order={4} mt="md">
              Ocean Transportation
            </Title>
            <Text mt="sm" size="sm" c="dimmed">
              Reliable and secure global ocean shipping for all types of cargo,
              meeting international standards.
            </Text>
          </Card>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <IconTruck size={40} color={theme.colors.brand[8]} />
            <Title order={4} mt="md">
              Truck & Rail Freight
            </Title>
            <Text mt="sm" size="sm" c="dimmed">
              Efficient overland transportation solutions with real-time
              tracking and timely deliveries.
            </Text>
          </Card>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <IconShieldCheck size={40} color={theme.colors.brand[8]} />
            <Title order={4} mt="md">
              Cargo Insurance
            </Title>
            <Text mt="sm" size="sm" c="dimmed">
              Comprehensive cargo protection to safeguard your shipment from
              start to finish.
            </Text>
          </Card>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <IconBriefcase size={40} color={theme.colors.brand[8]} />
            <Title order={4} mt="md">
              Customs Brokerage
            </Title>
            <Text mt="sm" size="sm" c="dimmed">
              Seamless customs clearance services to expedite your shipments
              without delays.
            </Text>
          </Card>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <IconPackage size={40} color={theme.colors.brand[8]} />
            <Title order={4} mt="md">
              Fumigation
            </Title>
            <Text mt="sm" size="sm" c="dimmed">
              Certified fumigation services to ensure compliance with
              international shipping standards.
            </Text>
          </Card>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <IconBoxMultiple size={40} color={theme.colors.brand[8]} />
            <Title order={4} mt="md">
              Container Sizes
            </Title>
            <Text mt="sm" size="sm" c="dimmed">
              A variety of container options to accommodate shipments of all
              sizes and specifications.
            </Text>
          </Card>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
