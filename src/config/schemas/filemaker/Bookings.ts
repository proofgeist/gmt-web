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
  holdStatusArray: z.preprocess((val) => {
    if (typeof val === "string" && val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        return [];
      }
    }
    return [];
  }, z.array(HoldStatusEnum)),
});

export type TBookings = z.infer<typeof ZBookings>;
