import { z } from "zod";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";

export const mfaEnrollSchema = z.object({
  phoneNumber: z
    .string()
    .refine((value) => isValidPhoneNumber(value), {
      message: "Please enter a valid phone number with country code",
    })
    .transform((value) => {
      const phoneNumber = parsePhoneNumberWithError(value);
      return phoneNumber.format("E.164"); // Returns number in +12345678900 format
    }),
    code: z.string().length(6).optional(),
});

