/**
 * Put your custom overrides or transformations here.
 * Changes to this file will NOT be overwritten.
 */
import { z } from "zod";
import { ZBookings as ZBookings_generated } from "./generated/Bookings";

export const HoldStatusEnum = z.enum([
  "Customs Hold",
  "Shipper Hold",
  "Finance Hold",
  "GMT Hold",
  "Agent Hold",
]);

export const ZBookings = ZBookings_generated.extend({
  holdStatusList: z.preprocess((val) => {
    if (typeof val === "string" && val) {
      return val.split("\r");
    } else if (Array.isArray(val)) {
      return val as string[];
    }
    return [];
  }, z.array(HoldStatusEnum)),
});

export type TBookings = z.infer<typeof ZBookings>;
