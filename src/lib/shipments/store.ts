import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShipmentType } from "@/app/(protected)/dashboard/schema";

interface ShipmentStore {
  shipmentType: ShipmentType;
  setShipmentType: (type: ShipmentType) => void;
}

export const useShipmentStore = create<ShipmentStore>()(
  persist(
    (set) => ({
      shipmentType: "active",
      setShipmentType: (type) => set({ shipmentType: type }),
    }),
    {
      name: "shipment-store",
    }
  )
);
