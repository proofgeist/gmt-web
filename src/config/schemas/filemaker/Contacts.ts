
  /**
  * Put your custom overrides or transformations here.
  * Changes to this file will NOT be overwritten.
  */
  import { z } from "zod";
  import { ZContacts as ZContacts_generated } from "./generated/Contacts";

  export const ZContacts = ZContacts_generated.extend({
    hasWebAccess: z.preprocess((val) => {
    if (val === 1) {
      return true;
    } else {
      return false;
    }
  }, z.boolean()),
  });

  export type TContacts = z.infer<typeof ZContacts>;
