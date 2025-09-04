import {
  getActiveShipmentsAction,
  getPendingShipmentsAction,
  getPastShipmentsAction,
  getHoldsShipmentsAction,
  getShipmentByTypeAction,
} from "./actions";
import { useQuery } from "@tanstack/react-query";
import { ShipmentType } from "./my-shipments/schema";

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

  const holdsShipments = useQuery({
    queryKey: ["holdsShipments"],
    queryFn: () => getHoldsShipmentsAction({}),
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
    holdsShipments,
    shipmentsByType,
  };
}
