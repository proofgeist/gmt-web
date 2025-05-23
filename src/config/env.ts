import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { type OttoAPIKey } from "@proofkit/fmdapi";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    FM_DATABASE: z.string().endsWith(".fmp12"),
    FM_SERVER: z.string().url(),
    OTTO_API_KEY: z.string().startsWith("dk_") as z.ZodType<OttoAPIKey>,
    RESEND_API_KEY: z.string().startsWith("re_"),
  },
  client: {},
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {},
});
