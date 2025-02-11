import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";
import { z } from "zod";

export const updateEmailSchema = z.object({
  email: z.string().email(),
});

export const updatePreferencesSchema = z.object({
  language: z.enum(["en", "es"]),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(255, { message: "Password is too long" }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

export const updatePhoneNumberSchema = z.object({
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
