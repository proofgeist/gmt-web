import { getShipmentByTypeAction } from "./actions";
import { useQuery } from "@tanstack/react-query";
import { ShipmentType } from "./dashboard/schema";

/**
 * Hook to fetch active shipments
 * Uses the same queryKey as server prefetch for instant hydration
 */
export function useActiveShipments() {
  return useQuery({
    queryKey: ["shipmentData", "active"],
    queryFn: () => getShipmentByTypeAction({ type: "active" }).then((data) => data?.data ?? []),
  });
}

/**
 * Hook to fetch completed shipments
 * Uses the same queryKey as server prefetch for instant hydration
 */
export function useCompletedShipments() {
  return useQuery({
    queryKey: ["shipmentData", "completed"],
    queryFn: () => getShipmentByTypeAction({ type: "completed" }).then((data) => data?.data ?? []),
  });
}

/**
 * Hook to fetch shipments by dynamic type
 * Used when the shipment type can change (e.g., user selection)
 */
export function useShipmentsByType(shipmentType?: ShipmentType) {
  return useQuery({
    queryKey: ["shipmentData", shipmentType],
    queryFn: async () => {
      if (!shipmentType) return [];
      return getShipmentByTypeAction({ type: shipmentType }).then((data) => data?.data);
    },
    enabled: !!shipmentType,
  });
}
