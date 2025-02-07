"use server";

import { actionClient } from "@/server/safe-action";
import { mfaEnrollSchema } from "./schema";
import {
  createSession,
  generateSessionToken,
  getCurrentSession,
  setSessionTokenCookie,
} from "@/server/auth/utils/session";
import { redirect } from "next/navigation";
import { updateUserPhoneNumber } from "@/server/auth/utils/user";
import { sendVerificationCodeAction } from "../actions";
import { cookies } from "next/headers";
import twilio from "twilio";
import { getRedirectCookie } from "@/server/auth/utils/redirect";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

type ActionResult = { codeSent: true } | { error: string };

export const mfaEnrollAction = actionClient
  .schema(mfaEnrollSchema)
  .action(async ({ parsedInput }): Promise<ActionResult> => {
    const cookieStore = await cookies();
    const pendingUserID = cookieStore.get("pending_user_id")?.value;

    if (!pendingUserID) {
      return { error: "No pending user found" };
    }

    const { phoneNumber, code } = parsedInput;

    // If no code provided, send verification code
    if (!code) {
      try {
        const result = await sendVerificationCodeAction({ phoneNumber });

        if (!result || "error" in result) {
          return {
            error:
              typeof result?.error === "string" ?
                result.error
              : "An error occurred",
          };
        }

        cookieStore.set("pending_phone_number", phoneNumber, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        return { codeSent: true };
      } catch (error) {
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
          throw error;
        }
        console.error("Error sending MFA code:", error);
        return { error: "Failed to send verification code" };
      }
    }

    // If code is provided, verify it
    try {
      const storedPhoneNumber = cookieStore.get("pending_phone_number")?.value;
      if (!storedPhoneNumber) {
        return { error: "No pending phone number found" };
      }

      const verification = await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verificationChecks.create({
          to: storedPhoneNumber,
          code,
        });

      if (verification.status !== "approved") {
        return { error: "Invalid code" };
      }

      // Update user's phone number after successful verification
      await updateUserPhoneNumber(pendingUserID, storedPhoneNumber);

      // Clean up cookies
      cookieStore.delete("pending_phone_number");
      cookieStore.delete("pending_user_id");

      // Set the actual session cookie
      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, pendingUserID);
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
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        throw error;
      }
      console.error("Error verifying code:", error);
      return { error: "Failed to verify code" };
    }
  });
