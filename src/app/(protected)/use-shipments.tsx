import {
  getActiveShipmentsAction,
  getPendingShipmentsAction,
  getPastShipmentsAction,
  getShipmentByTypeAction,
} from "./actions";
import { useQuery } from "@tanstack/react-query";

type ShipmentType = "active" | "pending" | "completed";

export default function useShipments(shipmentType?: ShipmentType) {
  const activeShipments = useQuery({
    queryKey: ["activeShipments"],
    queryFn: () => getActiveShipmentsAction({}),
  });

  const pendingShipments = useQuery({
    queryKey: ["pendingShipments"],
    queryFn: () => getPendingShipmentsAction({}),
  });

  const pastShipments = useQuery({
    queryKey: ["pastShipments"],
    queryFn: () => getPastShipmentsAction({}),
  });

  const shipmentsByType = useQuery({
    queryKey: ["shipmentData", shipmentType],
    queryFn: async () => {
      if (!shipmentType) return [];
      const result = await getShipmentByTypeAction({ type: shipmentType });
      return result?.data ?? [];
    },
    enabled: !!shipmentType,
  });

  return {
    activeShipments,
    pendingShipments,
    pastShipments,
    shipmentsByType,
  };
}
