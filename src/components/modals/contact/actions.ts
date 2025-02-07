"use server";
import { actionClient } from "@/server/safe-action";
import { contactSchema } from "./schema";
import { InquiriesLayout } from "@/config/schemas/filemaker/client";

type ContactActionResult = { success: true } | { success: false; error: string };
export const contactAction = actionClient
  .schema(contactSchema)
  .action(async ({ parsedInput }) => {
    const { companyName, firstName, lastName, email, cell, message } =
      parsedInput;

    try {
      await InquiriesLayout.create({
        fieldData: {
          companyName,
          firstName,
          lastName,
          emailAddress: email,
          phoneNumber: cell,
          message,
        },
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: "Failed to submit inquiry" };
    }
  });
