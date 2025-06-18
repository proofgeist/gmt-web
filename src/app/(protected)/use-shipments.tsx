import {
  getActiveShipmentsAction,
  getPendingShipmentsAction,
  getPastShipmentsAction,
} from "./actions";
import { useQuery } from "@tanstack/react-query";

export default function useShipments() {
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
  return {
    activeShipments,
    pendingShipments,
    pastShipments,
  };
}
