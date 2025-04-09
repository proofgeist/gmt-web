"use server";
import { actionClient } from "@/server/safe-action";
import { contactSchema } from "./schema";
import { InquiriesLayout } from "@/config/schemas/filemaker/client";
import { sendContactEmail } from "@/server/auth/utils/inquiries";

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

      await sendContactEmail({
        to: "gmt-bookings@globalmarinetransportation.com",
        email,
        firstName,
        lastName,
        companyName,
        message,
        cell: cell || "",
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: "Failed to submit inquiry" };
    }
  });
