"use client";

import {
  Container,
  Group,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { ServiceData } from "@/data/services";
import { Transition } from "@mantine/core";

interface ServiceDetailProps {
  service: ServiceData;
  onPrevious: () => void;
  onNext: () => void;
}

export function ServiceDetail({
  service,
  onPrevious,
  onNext,
}: ServiceDetailProps) {
  return (
    <Container size="xl" mb="xl">
      <Transition
        mounted={true}
        transition="slide-up"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Paper
            shadow="sm"
            p="xl"
            style={{
              ...styles,
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
            }}
          >
            <Group justify="space-between" mb="md">
              <IconArrowLeft
                style={{ cursor: "pointer" }}
                onClick={onPrevious}
                size={24}
              />
              <Title order={3}>{service.title}</Title>
              <IconArrowRight
                style={{ cursor: "pointer" }}
                onClick={onNext}
                size={24}
              />
            </Group>
            <Text mb="md">{service.detailedDescription}</Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              {service.features.map((feature, idx) => (
                <Text key={idx}>• {feature}</Text>
              ))}
            </SimpleGrid>
          </Paper>
        )}
      </Transition>
    </Container>
  );
}
