import { z } from "zod";

export const contactSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  cell: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});
