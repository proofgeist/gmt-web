import { Group, Stack } from "@mantine/core";
import React, { Suspense } from "react";

import TableContent from "./table";

import QuotesCard from "./quotes-card";
import ShipmentCards from "./shipment-cards";
import ShipmentCardsSkeleton from "./shipment-cards-skeleton";
import TableSkeleton from "./table-skeleton";

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
