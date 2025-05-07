import { Group, Stack } from "@mantine/core";
import React, { Suspense } from "react";

import TableContent from "./table";

import ShipmentCards from "./shipment-cards";

export default function TablePage() {
  return (
    <Stack>
      <ShipmentCards />

      <TableContent />
    </Stack>
  );
}
