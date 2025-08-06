"use server";
import { actionClient } from "@/server/safe-action";
import { contactSchema } from "./schema";
import { sendContactEmail } from "@/server/auth/utils/inquiries";
import { DEFAULT_INBOX } from "@/config/email";

export const contactAction = actionClient
  .schema(contactSchema)
  .action(async ({ parsedInput }) => {
    const { companyName, firstName, lastName, email, cell, message } =
      parsedInput;

    try {
      await sendContactEmail({
        to: DEFAULT_INBOX,
        email,
        firstName,
        lastName,
        companyName,
        message,
        cell: cell || "",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to submit inquiry" };
    }
  });
