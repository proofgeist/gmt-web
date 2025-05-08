
  /**
  * Put your custom overrides or transformations here.
  * Changes to this file will NOT be overwritten.
  */
  import { z } from "zod";
  import { ZBookingDetails as ZBookingDetails_generated } from "./generated/BookingDetails";

  export const ZBookingDetails = ZBookingDetails_generated;

  export type TBookingDetails = z.infer<typeof ZBookingDetails>;
