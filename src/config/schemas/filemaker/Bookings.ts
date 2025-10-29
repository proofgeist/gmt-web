/**
 * Put your custom overrides or transformations here.
 * Changes to this file will NOT be overwritten.
 */
import { z } from "zod";
import { ZBookings as ZBookings_generated } from "./generated/Bookings";

export const HoldStatusEnum = z.enum([
  "Customs Hold",
  "Shipper Hold",
  "Shipper Hold Requested",
  "Finance Hold",
  "Agent Hold",
  "Vendor Hold",
]);

export const ZBookings = ZBookings_generated.extend({
  holdStatusList: z.preprocess((val) => {
    // First, split the string into an array if needed
    let arr: string[] = [];
    if (typeof val === "string" && val) {
      arr = val.split("\r");
    } else if (Array.isArray(val)) {
      arr = val as string[];
    }

    // Filter out invalid enum values (like "GMT hold")
    return arr.filter((item) => {
      const result = HoldStatusEnum.safeParse(item);
      return result.success;
    });
  }, z.array(HoldStatusEnum)),
});

export type TBookings = z.infer<typeof ZBookings>;
