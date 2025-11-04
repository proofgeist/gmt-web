import { env } from "@/config/env";

export const EMAIL_BASE_URL =
  env.NODE_ENV === "production" ? "https://www.mygmt.com" : "http://localhost:3000";

