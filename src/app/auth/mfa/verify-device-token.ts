"use server";

import { actionClient } from "@/server/safe-action";
import { z } from "zod";
import { getDeviceToken } from "@/server/auth/utils/device-token";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/server/auth/utils/session";
import { getRedirectCookie } from "@/server/auth/utils/redirect";
import { redirect } from "next/navigation";

const verifyDeviceTokenSchema = z.object({
  pendingUserId: z.string(),
});

export const verifyDeviceTokenAction = actionClient
  .schema(verifyDeviceTokenSchema)
  .action(async ({ parsedInput }) => {
    const { pendingUserId } = parsedInput;
    const deviceToken = await getDeviceToken();

    if (!deviceToken) {
      return { error: "No device token found" };
    }

    // Set the actual session cookie
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, pendingUserId);
    setSessionTokenCookie(sessionToken, session.expiresAt);

    // Get and clear redirect cookie, then redirect
    const redirectTo = await getRedirectCookie();
    return redirect(redirectTo);
  });