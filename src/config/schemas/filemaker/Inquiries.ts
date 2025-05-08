
  /**
  * Put your custom overrides or transformations here.
  * Changes to this file will NOT be overwritten.
  */
  import { z } from "zod";
  import { ZInquiries as ZInquiries_generated } from "./generated/Inquiries";

  export const ZInquiries = ZInquiries_generated;

  export type TInquiries = z.infer<typeof ZInquiries>;
