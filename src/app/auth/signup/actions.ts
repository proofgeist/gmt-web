"use server";

import { actionClient } from "@/server/safe-action";
import { signupSchema } from "./schema";
import {
  checkEmailAvailability,
  createUser,
  getWebEnabledContactID,
} from "@/server/auth/utils/user";
import { verifyPasswordStrength } from "@/server/auth/utils/password";
import { redirect } from "next/navigation";
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from "@/server/auth/utils/email-verification";
import { cookies } from "next/headers";

export const signupAction = actionClient
  .schema(signupSchema)
  .action(async ({ parsedInput }) => {
    const { email, password, language } = parsedInput;
    const emailAvailable = await checkEmailAvailability(email);
    if (!emailAvailable) {
      return { error: "Email already in use" };
    }

    const passwordStrong = await verifyPasswordStrength(password);
    if (!passwordStrong) {
      return { error: "Password is too weak" };
    }

    let contactID: string;
    try {
      contactID = await getWebEnabledContactID(email);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    const user = await createUser(email, password, contactID, language);
    const emailVerificationRequest = await createEmailVerificationRequest(
      user.id,
      user.email
    );
    await sendVerificationEmail(
      emailVerificationRequest.email,
      emailVerificationRequest.code
    );
    await setEmailVerificationRequestCookie(emailVerificationRequest);

    // Store user ID and phone number for MFA verification
    const cookieStore = await cookies();
    cookieStore.set("pending_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    return redirect("/auth/mfa/enroll");
  });
