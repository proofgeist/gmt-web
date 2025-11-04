"use server";
import { actionClient } from "@/server/safe-action";
import { z } from "zod";
import {
  updateEmailSchema,
  updatePasswordSchema,
  updatePhoneNumberSchema,
  updatePreferencesSchema,
} from "./schema";
import {
  createSession,
  generateSessionToken,
  getCurrentSession,
  invalidateUserSessions,
  setSessionTokenCookie,
} from "@/server/auth/utils/session";
import {
  checkEmailAvailability,
  updateUserPassword,
  validateLogin,
  updateUserPhoneNumber,
  updateUserPreferences,
  updateUserEmailAndSetEmailAsVerified,
} from "@/server/auth/utils/user";
import { verifyPasswordStrength } from "@/server/auth/utils/password";
import { usersLayout } from "@/server/auth/db/client";
import twilio from "twilio";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const missingVars: string[] = [];
if (!TWILIO_ACCOUNT_SID) missingVars.push("TWILIO_ACCOUNT_SID");
if (!TWILIO_AUTH_TOKEN) missingVars.push("TWILIO_AUTH_TOKEN");

if (missingVars.length > 0) {
  throw new Error(
    `Missing required Twilio environment variables: ${missingVars.join(", ")}`
  );
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const updatePreferencesAction = actionClient
  .schema(updatePreferencesSchema)
  .action(async ({ parsedInput }) => {
    const { session, user } = await getCurrentSession();
    if (session === null) {
      return {
        error: "Not authenticated",
      };
    }

    const { language } = parsedInput;
    await updateUserPreferences(user.id, { language });

    return {
      message: "Language preference updated",
    };
  });

export const updateEmailAction = actionClient
  .schema(updateEmailSchema)
  .action(async ({ parsedInput }) => {
    const { session, user } = await getCurrentSession();
    if (session === null) {
      return {
        error: "Not authenticated",
      };
    }

    const { email } = parsedInput;

    const emailAvailable = await checkEmailAvailability(email);
    if (!emailAvailable) {
      return {
        error: "This email is already used",
      };
    }

    await updateUserEmailAndSetEmailAsVerified(user.id, email);

    return {
      message: "Email updated",
    };
  });

export const updatePasswordAction = actionClient
  .schema(updatePasswordSchema)
  .action(async ({ parsedInput }) => {
    const { currentPassword, newPassword } = parsedInput;

    const { session, user } = await getCurrentSession();
    if (session === null) {
      return {
        error: "Not authenticated",
      };
    }

    const strongPassword = await verifyPasswordStrength(newPassword);
    if (!strongPassword.success) {
      return {
        error: strongPassword.message,
      };
    }

    const validPassword = Boolean(
      await validateLogin(user.email, currentPassword)
    );
    if (!validPassword) {
      return {
        error: "Incorrect password",
      };
    }

    await invalidateUserSessions(user.id);
    await updateUserPassword(user.id, newPassword);

    const sessionToken = generateSessionToken();
    const newSession = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, newSession.expiresAt);
    return {
      message: "Password updated",
    };
  });

export const updatePhoneNumberAction = actionClient
  .schema(updatePhoneNumberSchema)
  .action(async ({ parsedInput }) => {
    const { session, user } = await getCurrentSession();
    if (session === null) {
      return {
        error: "Not authenticated",
      };
    }

    const { phoneNumber, code } = parsedInput;

    // If no code provided, send verification code
    if (!code) {
      try {
        if (!process.env.TWILIO_VERIFY_SERVICE_SID) {
          return { error: "Twilio service not configured" };
        }
        await client.verify.v2
          .services(process.env.TWILIO_VERIFY_SERVICE_SID)
          .verifications.create({
            to: phoneNumber,
            channel: "sms",
          });

        return { codeSent: true };
      } catch (error) {
        console.error("Failed to send verification code:", error);
        return { error: "Failed to send verification code" };
      }
    }

    // If code is provided, verify it
    try {
      if (!process.env.TWILIO_VERIFY_SERVICE_SID) {
        return { error: "Twilio service not configured" };
      }
      const verification = await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({
          to: phoneNumber,
          code,
        });

      if (verification.status !== "approved") {
        return { error: "Invalid code" };
      }

      // Update user's phone number after successful verification
      await updateUserPhoneNumber(user.id, phoneNumber);

      return { success: true, message: "Phone number updated successfully" };
    } catch (error) {
      console.error("Failed to verify code:", error);
      return { error: "Failed to verify code" };
    }
  });

export const toggleDailyReportOptInAction = actionClient
  .schema(z.object({ optIn: z.boolean() }))
  .action(async ({ parsedInput }) => {
    const { session, user } = await getCurrentSession();
    if (session === null) {
      return {
        error: "Not authenticated",
      };
    }

    const userRecord = await usersLayout.findOne({
      query: { id: `==${user.id}` },
    });

    await usersLayout.update({
      recordId: userRecord.data.recordId,
      fieldData: { dailyReportOptIn: parsedInput.optIn ? 1 : 0 },
    });

    return {
      message:
        parsedInput.optIn ?
          "You will now receive daily booking reports"
        : "You have been unsubscribed from daily booking reports",
      optIn: parsedInput.optIn,
    };
  });
