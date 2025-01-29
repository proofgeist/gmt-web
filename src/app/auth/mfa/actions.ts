"use server";

import { actionClient } from "@/server/safe-action";
import { z } from "zod";
import { cookies } from "next/headers";
import { verifyCode } from "./mfa";
import { redirect } from "next/navigation";
import { getRedirectCookie } from "@/server/auth/utils/redirect";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/server/auth/utils/session";

const verifyMFASchema = z.object({
  code: z.string().length(6),
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
      const result = await verifyCode(phoneNumber, code);

      if (!result.verified) {
        return { error: "Invalid code" };
      }

      // Clean up pending cookies
      cookieStore.delete("pending_phone_number");
      cookieStore.delete("pending_user_id");

      // Set the actual session cookie
      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, userId);
      setSessionTokenCookie(sessionToken, session.expiresAt);

      // Get and clear redirect cookie, then redirect
      const redirectTo = await getRedirectCookie();
      return redirect(redirectTo);
    } catch (error) {
      console.error("Error verifying code:", error);
      return { error: "Failed to verify code" };
    }
  });
