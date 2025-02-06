"use client";

import { Card, Group, Text } from "@mantine/core";
import { ServiceData } from "@/data/services";
import styles from "../../app/(public)/page.module.css";

interface ServiceCardProps {
  service: ServiceData;
  onClick: () => void;
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  return (
    <Card
      className={styles.glassCard}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
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
  );
}
