"use server";

import { authedActionClient } from "@/server/safe-action";
import {
  getMyShipmentsSchema,
  getMyShipmentsByGMTNumberSchema,
  getShipmentByTypeSchema,
} from "./dashboard/schema";
import {
  getActiveShipments,
  getPastShipments,
  getHoldsShipments,
  getShipmentByGMTNumber,
  getShipmentsByType,
} from "@/lib/shipments/queries";
export const getShipmentByTypeAction = authedActionClient
  .schema(getShipmentByTypeSchema)
  .action(async ({ ctx, parsedInput }) => {
    try {
      const { type } = parsedInput;
      return getShipmentsByType(ctx, type);
    } catch (error) {
      // Log actual error for debugging
      console.error("Error fetching shipments:", error);
      // Throw generic error
      throw new Error("Failed to fetch shipments");
    }
  });

export const getActiveShipmentsAction = authedActionClient
  .schema(getMyShipmentsSchema)
  .action(async ({ ctx }) => {
    return getActiveShipments(ctx);
  });
export const getPastShipmentsAction = authedActionClient
  .schema(getMyShipmentsSchema)
  .action(async ({ ctx }) => {
    return getPastShipments(ctx);
  });
export const getHoldsShipmentsAction = authedActionClient
  .schema(getMyShipmentsSchema)
  .action(async ({ ctx }) => {
    return getHoldsShipments(ctx);
  });

export const getMyShipmentsByGMTNumberAction = authedActionClient
  .schema(getMyShipmentsByGMTNumberSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { gmtNumber } = parsedInput;
    return getShipmentByGMTNumber(ctx, gmtNumber);
  });
