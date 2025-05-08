
  /**
  * Put your custom overrides or transformations here.
  * Changes to this file will NOT be overwritten.
  */
  import { z } from "zod";
  import { ZContacts as ZContacts_generated } from "./generated/Contacts";

  export const ZContacts = ZContacts_generated;

  export type TContacts = z.infer<typeof ZContacts>;
