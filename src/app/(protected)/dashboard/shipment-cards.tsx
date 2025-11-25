"use client";

import {
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import React, { useState } from "react";
import { IconShip, IconCircleCheck } from "@tabler/icons-react";
import type { ShipmentType } from "./schema";
import { useShipmentStore } from "@/lib/shipments/store";
import { useActiveShipments, useCompletedShipments } from "../use-shipments";

export default function ShipmentCards() {
  const shipmentType = useShipmentStore((state) => state.shipmentType);
  const setShipmentType = useShipmentStore((state) => state.setShipmentType);

  const { data: active = [] } = useActiveShipments();
  const { data: completed = [] } = useCompletedShipments();

  const theme = useMantineTheme();
  const [hovered, setHovered] = useState<number | null>(null);
  const cardData = [
    {
      icon: IconShip,
      title: "Active Shipments",
      value: active.length,
      type: "active" as ShipmentType,
    },
    {
      icon: IconCircleCheck,
      title: "Arrived Shipments",
      value: completed.length,
      type: "completed" as ShipmentType,
    },
  ];

  return (
    <SimpleGrid cols={2}>
      {cardData.map((card, index) => (
        <UnstyledButton
          key={index}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setShipmentType(card.type)}
          style={{
            cursor: "pointer",
            borderRadius: theme.radius.md,
            height: "100%",
          }}
        >
          <Card
            shadow="sm"
            padding="sm"
            radius="md"
            withBorder
            style={{
              borderColor:
                shipmentType === card.type ?
                  theme.colors?.brand?.[9]
                  : undefined,
              borderWidth: shipmentType === card.type ? 2 : 1,
              backgroundColor:
                hovered === index || shipmentType === card.type ?
                  theme.colors.brand[0]
                  : undefined,
              transition: "background-color 0.3s ease",
              height: "100%",
            }}
          >
            <Stack align="center" justify="center" gap="xs">
              <Group align="center" maw={200} w={"100%"} justify="center">
                <card.icon
                  size={40}
                  color={theme.colors?.brand?.[9]}
                  stroke={1.5}
                />
                <Text fz={32} fw={700}>
                  {card.value}
                </Text>
              </Group>
              <Text fz="lg" c="dimmed" ta="center">
                {card.title}
              </Text>
            </Stack>
          </Card>
        </UnstyledButton>
      ))}
    </SimpleGrid>
  );
}
