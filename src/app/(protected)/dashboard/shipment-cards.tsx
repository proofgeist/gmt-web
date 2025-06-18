"use client";

import { Card, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import React from "react";
import { IconShip, IconClockHour4, IconCircleCheck } from "@tabler/icons-react";
import {
  getActiveShipmentsAction,
  getPendingShipmentsAction,
  getPastShipmentsAction,
} from "../actions";
import QuotesCard from "./quotes-card";
import { theme } from "@/config/theme/mantine-theme";
import useShipments from "../use-shipments";

type ShipmentType = "active" | "pending" | "completed";

interface ShipmentCardsProps {
  shipmentType: ShipmentType;
  setShipmentType: (value: ShipmentType) => void;
}

export default function ShipmentCards({
  shipmentType,
  setShipmentType,
}: ShipmentCardsProps) {
  const { activeShipments, pendingShipments, pastShipments } = useShipments();


  const cardData = [
    {
      icon: IconShip,
      title: "Active Shipments",
      value: activeShipments?.data?.data?.length || 0,
      type: "active" as ShipmentType,
    },
    {
      icon: IconClockHour4,
      title: "Pending Shipments",
      value: pendingShipments?.data?.data?.length || 0,
      type: "pending" as ShipmentType,
    },
    {
      icon: IconCircleCheck,
      title: "Complete Shipments",
      value: pastShipments?.data?.data?.length || 0,
      type: "completed" as ShipmentType,
    },
  ];

  return (
    <Group grow align="stretch" preventGrowOverflow>
      {cardData.map((card, index) => (
        <UnstyledButton key={index} onClick={() => setShipmentType(card.type)}>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{
              borderColor:
                shipmentType === card.type ?
                  theme.colors?.brand?.[9]
                : undefined,
              borderWidth: shipmentType === card.type ? 2 : 1,
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
      <QuotesCard />
    </Group>
  );
}
