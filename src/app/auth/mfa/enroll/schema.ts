import { z } from "zod";

export const mfaEnrollSchema = z
  .object({
    phoneNumber: z.string().transform((num) => num.replace(/[^\d]/g, "")),
  })
  .refine((data) => data.phoneNumber.length >= 11, {
    path: ["phoneNumber"],
    message:
      "Phone number must be at least 11 characters long - include country code",
  })
  .transform((data) => ({
    ...data,
    phoneNumber: `+${data.phoneNumber}`,
  }));
