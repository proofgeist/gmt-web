"use server";
import { actionClient } from "@/server/safe-action";
import { contactSchema } from "./schema";

type ContactActionResult = { success: true } | { error: string };
export const contactAction = actionClient
  .schema(contactSchema)
  .action(async ({ parsedInput }): Promise<ContactActionResult> => {
    // TODO: Implement contact form submission logic
    return { success: true };
  });
