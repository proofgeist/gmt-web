import {
  getActiveShipmentsAction,
  getPendingShipmentsAction,
  getPastShipmentsAction,
  getHoldsShipmentsAction,
  getShipmentByTypeAction,
} from "./actions";
import { useQuery } from "@tanstack/react-query";
import { ShipmentType } from "./my-shipments/schema";
import type { TBookings } from "@/config/schemas/filemaker/Bookings";

export default function useShipments(
  shipmentType?: ShipmentType,
  initialData?: TBookings[]
) {
  const activeShipments = useQuery({
    queryKey: ["activeShipments"],
    queryFn: () => getActiveShipmentsAction({}).then((data) => data?.data),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    placeholderData: (previousData) => initialData ?? previousData,
  });

  const pendingShipments = useQuery({
    queryKey: ["pendingShipments"],
    queryFn: () => getPendingShipmentsAction({}).then((data) => data?.data),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    placeholderData: (previousData) => initialData ?? previousData,
  });

  const pastShipments = useQuery({
    queryKey: ["pastShipments"],
    queryFn: () => getPastShipmentsAction({}).then((data) => data?.data),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    placeholderData: (previousData) => initialData ?? previousData,
  });

  const holdsShipments = useQuery({
    queryKey: ["holdsShipments"],
    queryFn: () => getHoldsShipmentsAction({}).then((data) => data?.data),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    placeholderData: (previousData) => initialData ?? previousData,
  });

  const shipmentsByType = useQuery({
    queryKey: ["shipmentData", shipmentType],
    queryFn: async () => {
      if (!shipmentType) return [];
      return getShipmentByTypeAction({ type: shipmentType }).then((data) => data?.data);
    },
    enabled: !!shipmentType,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  });

  return {
    activeShipments,
    pendingShipments,
    pastShipments,
    holdsShipments,
    shipmentsByType,
  };
}
