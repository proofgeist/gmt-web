"use server";

import { actionClient } from "@/server/safe-action";
import { z } from "zod";
import { cookies } from "next/headers";
// import { verifyCode } from "./mfa";
import { redirect } from "next/navigation";
import { getRedirectCookie } from "@/server/auth/utils/redirect";
import { createSession, generateSessionToken, getCurrentSession, setSessionTokenCookie } from "@/server/auth/utils/session";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const verifyMFASchema = z.object({
  code: z.string().length(6),
});

const sendVerificationSchema = z.object({
  phoneNumber: z.string(),
});

type SendVerificationResult = { success: true } | { error: string };

export const sendVerificationCodeAction = actionClient
  .schema(sendVerificationSchema)
  .action(async ({ parsedInput }): Promise<SendVerificationResult> => {
    const { phoneNumber } = parsedInput;

    try {
      await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verifications.create({
          to: phoneNumber,
          channel: "sms",
        });

      return { success: true };
    } catch (error) {
      console.error("Error sending verification:", error);
      return { error: "Failed to send verification code" };
    }
  });

export const verifyMFAAction = actionClient
  .schema(verifyMFASchema)
  .action(async ({ parsedInput }) => {
    const { code } = parsedInput;
    const cookieStore = await cookies();

    const phoneNumber = cookieStore.get("pending_phone_number")?.value;
    const userId = cookieStore.get("pending_user_id")?.value;

    if (!phoneNumber || !userId) {
      return { error: "Session expired. Please login again." };
    }

    try {
      const verification = await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verificationChecks.create({
          to: phoneNumber,
          code,
        });

      if (verification.status !== "approved") {
        return { error: "Invalid code" };
      }

      // Clean up pending cookies
      cookieStore.delete("pending_phone_number");
      cookieStore.delete("pending_user_id");

      // Set the actual session cookie
      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, userId);
      setSessionTokenCookie(sessionToken, session.expiresAt);

      // Check if the user is verified
      const { user } = await getCurrentSession();
      if (user === null) {
        return { error: "User not found" };
      }
      if (!user.emailVerified) {
        return redirect("/auth/verify-email");
      }

      // Get and clear redirect cookie, then redirect
      const redirectTo = await getRedirectCookie();
      return redirect(redirectTo);
    } catch (error) {
      if (error && (error as any).digest?.includes("NEXT_REDIRECT")) {
        throw error;
      }
      console.error("Error verifying code:", error);
      return { error: "Failed to verify code" };
    }
  });



