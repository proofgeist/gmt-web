"use client";

import { Group, Stack, Alert } from "@mantine/core";
import React, { Suspense } from "react";
import { useLocalStorage } from "@mantine/hooks";
import TableContent from "./table";
import ShipmentCards from "./shipment-cards";
import ShipmentCardsSkeleton from "./shipment-cards-skeleton";
import TableSkeleton from "./table-skeleton";
import { IconInfoCircle } from "@tabler/icons-react";

function CardsSkeleton() {
  return (
    <Group grow align="stretch" preventGrowOverflow>
      <ShipmentCardsSkeleton label="In-Transit" />
      <ShipmentCardsSkeleton label="Scheduled to Sail" />
      <ShipmentCardsSkeleton label="Previous Shipments" />
    </Group>
  );
}

export default function TablePage() {
  const [shipmentType, setShipmentType] = useLocalStorage<
    "active" | "pending" | "completed"
  >({
    key: "shipmentType",
    defaultValue: "active",
  });

  return (
    <Stack>
      <Suspense fallback={<CardsSkeleton />}>
        <ShipmentCards
          shipmentType={shipmentType}
          setShipmentType={setShipmentType}
        />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <TableContent shipmentType={shipmentType} />
      </Suspense>
      {(shipmentType === "active" || shipmentType === "pending") && (
        <Alert
          color="blue"
          variant="light"
          radius="md"
          my="xs"
        >
         <em>Schedules are estimates and subject to change.</em>
        </Alert>
      )}
    </Stack>
  );
}
