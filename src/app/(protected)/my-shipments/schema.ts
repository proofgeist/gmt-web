import { z } from "zod";

export const getMyShipmentsSchema = z.object({});

export const getMyShipmentsByGMTNumberSchema = z.object({
  gmtNumber: z.string(),
});
