/**
 * Put your custom overrides or transformations here.
 * Changes to this file will NOT be overwritten.
 */
import { z } from "zod/v3";
import {
  Zbookings_CARGO as Zbookings_CARGO_generated,
  ZBookingsDetails as ZBookingsDetails_generated,
} from "./generated/BookingsDetails";
import { InferZodPortals } from "@proofkit/fmdapi";
import { HoldStatusEnum } from "./Bookings";

export const Zbookings_CARGO = Zbookings_CARGO_generated;

export type Tbookings_CARGO = z.infer<typeof Zbookings_CARGO>;

export const ZBookingsDetails = ZBookingsDetails_generated.extend({
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
;

export type TBookingsDetails = z.infer<typeof ZBookingsDetails>;

export const ZBookingsDetailsPortals = {
  bookings_CARGO: Zbookings_CARGO,
};

export type TBookingsDetailsPortals = InferZodPortals<
  typeof ZBookingsDetailsPortals
>;
