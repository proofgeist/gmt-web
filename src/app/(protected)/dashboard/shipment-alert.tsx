"use client";

import { Alert } from "@mantine/core";
import { useShipmentStore } from "@/lib/shipments/store";

export default function ShipmentAlert() {
  const shipmentType = useShipmentStore((state) => state.shipmentType);
  
  if (shipmentType !== "active") {
    return null;
  }

  return (
    <Alert
      color="blue"
      variant="light"
      radius="md"
      my="xs"
    >
      <em>Schedules are estimates and subject to change.</em>
    </Alert>
  );
}
