
  /**
  * Put your custom overrides or transformations here.
  * Changes to this file will NOT be overwritten.
  */
  import { z } from "zod";
  import { ZBookings as ZBookings_generated } from "./generated/Bookings";

  export const ZBookings = ZBookings_generated;

  export type TBookings = z.infer<typeof ZBookings>;
