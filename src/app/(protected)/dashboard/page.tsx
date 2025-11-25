import { Suspense } from "react";
import { Stack } from "@mantine/core";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  getActiveShipments,
  getPastShipments,
} from "@/lib/shipments/queries";
import { getCurrentSession } from "@/server/auth/utils/session";
import getQueryClient from "@/config/get-query-client";
import ShipmentCards from "./shipment-cards";
import TableContent from "./table";
import ShipmentCardsSkeleton from "./shipment-cards-skeleton";
import TableSkeleton from "./table-skeleton";
import ShipmentAlert from "./shipment-alert";

export default async function DashboardPage() {
  const { user } = await getCurrentSession();
  const queryClient = getQueryClient();

  // Prefetch queries into the cache
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["shipmentData", "active"],
      queryFn: () => getActiveShipments({ user }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["shipmentData", "completed"],
      queryFn: () => getPastShipments({ user }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stack>
        <Suspense fallback={<ShipmentCardsSkeleton label="Loading Shipments" />}>
          <ShipmentCards />
        </Suspense>
        <Suspense fallback={<TableSkeleton />}>
          <TableContent />
        </Suspense>
        <ShipmentAlert />
      </Stack>
    </HydrationBoundary>
  );
}
