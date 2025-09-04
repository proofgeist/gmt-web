"use server";

import { actionClient } from "@/server/safe-action";
import { z } from "zod";
// import { verifyCode } from "./mfa";
import { redirect } from "next/navigation";
import { getRedirectCookie } from "@/server/auth/utils/redirect";
import {
  createSession,
  generateSessionToken,
  getCurrentSession,
  setSessionTokenCookie,
} from "@/server/auth/utils/session";
import {
  generateDeviceToken,
  setDeviceTokenCookie,
} from "@/server/auth/utils/device-token";
import twilio from "twilio";
import { deletePendingPhoneNumber, deletePendingUserId, getPendingPhoneNumber, getPendingUserId } from "@/server/auth/utils/user";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const verifyMFASchema = z.object({
  code: z.string().length(6),
  rememberDevice: z.boolean().default(false),
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
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        throw error;
      }
      return { error: "Failed to send verification code" };
    }
  });

export const verifyMFAAction = actionClient
  .schema(verifyMFASchema)
  .action(async ({ parsedInput }) => {
    const { code, rememberDevice } = parsedInput;

    const phoneNumber = await getPendingPhoneNumber();
    const pendingUserID = await getPendingUserId();

    if (!phoneNumber || !pendingUserID) {
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
      await deletePendingPhoneNumber();
      await deletePendingUserId();

      // Set the actual session cookie
      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, pendingUserID);
      setSessionTokenCookie(sessionToken, session.expiresAt);

      // If remember device is enabled, generate and store device token
      if (rememberDevice) {
        const deviceToken = generateDeviceToken(pendingUserID);
        setDeviceTokenCookie(deviceToken);
      }

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
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        throw error;
      }
      return { error: "Failed to verify code" };
    }
  });



