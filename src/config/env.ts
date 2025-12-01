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
    CRON_SECRET: z.string().min(16).default("dev-cron-secret-change-in-production"),
    // MSC Track & Trace API
    MSC_CLIENT_ID: z.string().uuid().optional(),
    MSC_TENANT_ID: z.string().uuid().optional(),
    MSC_SCOPE: z.string().optional(),
    MSC_CERT_THUMBPRINT: z.string().length(40).optional(), // SHA1 hex (40 chars)
    MSC_CERT_PRIVATE_KEY: z.string().optional(), // PEM private key (base64 encoded)
  },
  client: {},
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {},
});
