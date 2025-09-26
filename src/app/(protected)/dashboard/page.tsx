import { Suspense } from "react";
import { Stack } from "@mantine/core";
import {
  getActiveShipments,
  getPastShipments,
} from "@/lib/shipments/queries";
import { getCurrentSession } from "@/server/auth/utils/session";
import ShipmentCards from "./shipment-cards";
import TableContent from "./table";
import ShipmentCardsSkeleton from "./shipment-cards-skeleton";
import TableSkeleton from "./table-skeleton";
import ShipmentAlert from "./shipment-alert";

export default async function DashboardPage() {
  const { user } = await getCurrentSession();

  // Fetch initial data in parallel
  const [activeShipments, pastShipments] = await Promise.all([
    getActiveShipments({ user }),
    getPastShipments({ user }),
  ]);

  return (
    <Stack>
      <Suspense fallback={<ShipmentCardsSkeleton label="Loading Shipments" />}>
        <ShipmentCards
          initialData={{
            active: activeShipments,
            completed: pastShipments,
          }}
        />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <TableContent initialData={activeShipments} />
      </Suspense>
      <ShipmentAlert />
    </Stack>
  );
}
