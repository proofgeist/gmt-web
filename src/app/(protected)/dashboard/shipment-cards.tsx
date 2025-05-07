import { Card, Group, Stack, Text } from "@mantine/core";
import React from "react";
import { IconShip, IconClockHour4, IconCircleCheck } from "@tabler/icons-react";
import {
  getActiveShipmentsAction,
  getPendingShipmentsAction,
  getPastShipmentsAction,
} from "../actions";
import QuotesCard from "./quotes-card";
import { theme } from "@/config/theme/mantine-theme";
export default async function ShipmentCards() {
  const activeShipments = await getActiveShipmentsAction({});
  const pendingShipments = await getPendingShipmentsAction({});
  const pastShipments = await getPastShipmentsAction({});

  const cardData = [
    {
      icon: IconShip,
      title: "Active Shipments",
      value: activeShipments?.data?.length || 0,
    },
    {
      icon: IconClockHour4,
      title: "Pending Shipments",
      value: pendingShipments?.data?.length || 0,
    },
    {
      icon: IconCircleCheck,
      title: "Complete Shipments",
      value: pastShipments?.data?.length || 0,
    },
  ];

  return (
    <>
      {cardData.map((card, index) => (
        <Card shadow="sm" padding="lg" radius="md" withBorder key={index}>
          <Stack align="center" justify="center" gap="xs">
            <Group align="center" maw={125} w={"100%"} justify="center">
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
      ))}
      <QuotesCard />
    </>
  );
}
