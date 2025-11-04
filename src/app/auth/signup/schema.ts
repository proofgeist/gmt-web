import { isValidPhoneNumber, parsePhoneNumberWithError } from "libphonenumber-js";
import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    language: z.enum(["en", "es"]),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    company: z.string().min(1),
    phoneNumber: z
      .string()
      .refine((value) => isValidPhoneNumber(value), {
        message: "Please enter a valid phone number with country code",
      })
      .transform((value) => {
        const phoneNumber = parsePhoneNumberWithError(value);
        return phoneNumber.format("E.164"); // Returns number in +12345678900 format
      }),
    dailyReportOptIn: z.boolean().default(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
