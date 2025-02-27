import { z } from "zod";

export const getMyShipmentsSchema = z.object({});
export const getShipmentByTypeSchema = z.object({
  type: z.enum(["active", "pending", "completed"]),
});
export const getMyShipmentsByGMTNumberSchema = z.object({
  gmtNumber: z.string(),
});
