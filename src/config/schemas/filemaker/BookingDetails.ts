
  /**
  * Put your custom overrides or transformations here.
  * Changes to this file will NOT be overwritten.
  */
  import { z } from "zod";
  import { ZBookingDetails as ZBookingDetails_generated } from "./generated/BookingDetails";
import { HoldStatusEnum } from "./Bookings";

  export const ZBookingDetails = ZBookingDetails_generated.extend({
    holdStatusArray: z.preprocess((val) => {
      if (typeof val === "string" && val) {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return [];
    }, z.array(HoldStatusEnum)),
  });;

  export type TBookingDetails = z.infer<typeof ZBookingDetails>;
