/**
 * Put your custom overrides or transformations here.
 * Changes to this file will NOT be overwritten.
 */
import { z } from "zod";
import { ZBookingDetails as ZBookingDetails_generated } from "./generated/BookingDetails";
const HoldStatusEnum = z.enum([
  "Customs Hold",
  "Shipper Hold",
  "Finance Hold",
  "GMT Hold",
  "Agent Hold",
]);

export const ZBookingDetails = ZBookingDetails_generated.extend({
  holdStatusArray: z
    .union([z.string(), z.array(HoldStatusEnum)])
    .transform((val, ctx) => {
      if (val === "") return [];
      let array = [];
      if (typeof val === "string") {
        try {
          array = JSON.parse(val);
        } catch {
          return [];
        }
      } else if (Array.isArray(val)) {
        array = val;
      }
      if (Array.isArray(array)) {
        const result = z.array(HoldStatusEnum).safeParse(array);
        if (result.success) {
          return result.data;
        }
        result.error.issues.forEach(ctx.addIssue);
        return z.NEVER;
      }
      return [];
    }),
});

export type TBookingDetails = z.infer<typeof ZBookingDetails>;
