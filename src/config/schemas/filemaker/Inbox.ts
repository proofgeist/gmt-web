
  /**
  * Put your custom overrides or transformations here.
  * Changes to this file will NOT be overwritten.
  */
  import { z } from "zod/v3";
  import { ZInbox as ZInbox_generated } from "./generated/Inbox";

  export const ZInbox = ZInbox_generated;

  export type TInbox = z.infer<typeof ZInbox>;
