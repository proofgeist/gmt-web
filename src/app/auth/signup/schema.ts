import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email(),
    phoneNumber: z.string().transform((num) => num.replace(/[^\d]/g, "")),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.phoneNumber.length >= 11, {
    path: ["phoneNumber"],
    message:
      "Phone number must be at least 11 characters long - include country code",
  })
  .transform((data) => ({
    ...data,
    phoneNumber: `+${data.phoneNumber}`,
  }))
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
