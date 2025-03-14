import { Group, Paper, Stack, Skeleton, Text } from "@mantine/core";
import React from "react";

export default function ShipmentCardsSkeleton() {
  // Create three skeleton cards to match the three shipment cards
  return (
    <>
      {[
        "Pending Shipments",
        "Active Shipments",
        "Complete Shipments",
        "My Quotes",
      ].map((index) => (
        <Paper withBorder shadow="md" p={30} radius="md" key={index}>
          <Stack align="center" justify="center" gap="xs">
            <Group align="center" maw={125} w={"100%"} justify="center">
              <Skeleton height={40} circle />
              <Skeleton height={32} width={40} />
            </Group>
            <Text fz="lg" c="dimmed" ta="center">
              {index}
            </Text>
          </Stack>
        </Paper>
      ))}
    </>
  );
}
