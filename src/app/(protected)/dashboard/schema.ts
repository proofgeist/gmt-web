import { z } from "zod";
export const shipmentTypeEnum = z.enum([
  "active",
  "completed",
]);
export type ShipmentType = z.infer<typeof shipmentTypeEnum>;
export const getMyShipmentsSchema = z.object({});

export const getShipmentByTypeSchema = z.object({
  type: shipmentTypeEnum,
});
export const getMyShipmentsByGMTNumberSchema = z.object({
  gmtNumber: z.string(),
});
