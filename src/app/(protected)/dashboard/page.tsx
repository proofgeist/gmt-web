import { Stack } from "@mantine/core";
import React, { Suspense } from "react";

import TableContent from "./table";

import ShipmentCards from "./shipment-cards";
import ShipmentCardsSkeleton from "./shipment-cards-skeleton";

export default function TablePage() {
  return (
    <Stack>
      <Suspense fallback={<ShipmentCardsSkeleton />}>
        <ShipmentCards />
      </Suspense>

      <TableContent />
    </Stack>
  );
}
