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
import { IconShip, IconClockHour4, IconCircleCheck } from "@tabler/icons-react";
import useShipments from "../use-shipments";
import type { ShipmentType } from "../my-shipments/schema";

interface ShipmentCardsProps {
  shipmentType: ShipmentType;
  setShipmentType: (value: ShipmentType) => void;
}

export default function ShipmentCards({
  shipmentType,
  setShipmentType,
}: ShipmentCardsProps) {
  const { activeShipments, pendingShipments, pastShipments } =
    useShipments();
  const theme = useMantineTheme();
  const [hovered, setHovered] = useState<number | null>(null);
  const cardData = [
    {
      icon: IconShip,
      title: "In-Transit",
      value: activeShipments?.data?.data?.length || 0,
      type: "active" as ShipmentType,
    },
    {
      icon: IconClockHour4,
      title: "Scheduled to Sail",
      value: pendingShipments?.data?.data?.length || 0,
      type: "pending" as ShipmentType,
    },
    {
      icon: IconCircleCheck,
      title: "Arrived Shipments",
      value: pastShipments?.data?.data?.length || 0,
      type: "completed" as ShipmentType,
    },
  ];

  return (
    <SimpleGrid cols={3}>
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
