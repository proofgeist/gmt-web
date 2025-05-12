"use server";

import { actionClient } from "@/server/safe-action";
import { signupSchema } from "./schema";
import {
  checkEmailAvailability,
  createUser,
  getIsContactWebEnabled,
} from "@/server/auth/utils/user";
import { verifyPasswordStrength } from "@/server/auth/utils/password";
import { redirect } from "next/navigation";
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from "@/server/auth/utils/email-verification";
import { cookies } from "next/headers";
import { sendWebRequestEmail } from "@/server/auth/email";
import { DEFAULT_INBOX } from "@/config/email";

export const signupAction = actionClient
  .schema(signupSchema)
  .action(async ({ parsedInput }) => {
    const { email, password, language, firstName, lastName, company } = parsedInput;
    const emailAvailable = await checkEmailAvailability(email);
    if (!emailAvailable) {
      return { error: "Email already in use" };
    }

    const passwordStrong = await verifyPasswordStrength(password);
    if (!passwordStrong) {
      return { error: "Password is too weak" };
    }

    const webInfo = await getIsContactWebEnabled(email).catch((e) => {
      redirect(`/auth/signup/not-found?email=${email}&firstName=${firstName}&lastName=${lastName}&company=${company}`);
    });

    const { contactID, isWebEnabled } = webInfo;

    const user = await createUser(
      email,
      password,
      contactID,
      language,
      isWebEnabled
    );
    //If the user is web enabled, send them a verification email
    if (isWebEnabled) {
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
      //If the user is not web enabled, send an email to globalmarine to let them know they have a new web request
    } else {
      await sendWebRequestEmail({
        to: DEFAULT_INBOX,
        email,
        firstName,
        lastName,
        company,
      });
      return redirect("/auth/signup/request-sent");
    }
  });
