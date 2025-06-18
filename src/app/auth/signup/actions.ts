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
import { contactAction } from "@/components/modals/contact/actions";

export const signupAction = actionClient
  .schema(signupSchema)
  .action(async ({ parsedInput }) => {
    const {
      email,
      password,
      language,
      firstName,
      lastName,
      company,
      phoneNumber,
    } = parsedInput;
    const emailAvailable = await checkEmailAvailability(email);
    if (!emailAvailable) {
      return { error: "Email already in use" };
    }

    const passwordStrong = await verifyPasswordStrength(password);
    if (!passwordStrong) {
      return { error: "Password is too weak" };
    }

    const webInfo = await getIsContactWebEnabled(email).catch(() => {
      contactAction({
        companyName: company,
        firstName,
        lastName,
        email,
        cell: phoneNumber,
        message: `New web request from ${email}`,
      });
      const message = `We couldn't find a user with the email address ${email}. A request has been sent to Global Marine to create an account for you. You will receive an email once it is approved.`;
      const title = "No User Found";
      const params = new URLSearchParams({
        title,
        message,
        email,
        firstName,
        lastName,
        company,
        phoneNumber,
      });
      redirect(`/auth/signup/status?${params.toString()}`);
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

      return redirect(`/auth/mfa/enroll?phoneNumber=${phoneNumber}`);
      //If the user is not web enabled, send an email to globalmarine to let them know they have a new web request
    } else {
      await sendWebRequestEmail({
        to: DEFAULT_INBOX,
        email,
        firstName,
        lastName,
        company,
      });
      const message =
        "Your web request has been sent to Global Marine for approval. You will receive an email once it is approved.";
      const title = "Request Sent";
      const params = new URLSearchParams({
        title,
        message,
        email,
        firstName,
        lastName,
        company,
        phoneNumber,
      });
      return redirect(`/auth/signup/status?${params.toString()}`);
    }
  });
