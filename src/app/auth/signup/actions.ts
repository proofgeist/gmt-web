"use server";

import { actionClient } from "@/server/safe-action";
import { signupSchema } from "./schema";
import { checkEmailAvailability, createUser } from "@/server/auth/utils/user";
import { verifyPasswordStrength } from "@/server/auth/utils/password";
import {
  createSession,
  setSessionTokenCookie,
} from "@/server/auth/utils/session";
import { generateSessionToken } from "@/server/auth/utils/session";
import { redirect } from "next/navigation";
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from "@/server/auth/utils/email-verification";

export const signupAction = actionClient
  .schema(signupSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput;
    const emailAvailable = await checkEmailAvailability(email);
    if (!emailAvailable) {
      return { error: "Email already in use" };
    }

    const passwordStrong = await verifyPasswordStrength(password);
    if (!passwordStrong) {
      return { error: "Password is too weak" };
    }

    const user = await createUser(email, password);
    const emailVerificationRequest = await createEmailVerificationRequest(
      user.id,
      user.email,
    );
    await sendVerificationEmail(
      emailVerificationRequest.email,
      emailVerificationRequest.code,
    );
    await setEmailVerificationRequestCookie(emailVerificationRequest);

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    setSessionTokenCookie(sessionToken, session.expiresAt);

    return redirect("/auth/verify-email");
  });
