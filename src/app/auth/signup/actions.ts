"use server";

import { actionClient } from "@/server/safe-action";
import { signupSchema } from "./schema";
import {
  checkEmailAvailability,
  createUser,
  createUserRequest,
  getIsContactWebEnabled,
} from "@/server/auth/utils/user";
import { verifyPasswordStrength } from "@/server/auth/utils/password";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { sendWebRequestEmail } from "@/utils/email";
import { DEFAULT_MANAGER_INBOX } from "@/config/email";

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
      dailyReportOptIn,
    } = parsedInput;
    const emailAvailable = await checkEmailAvailability(email);
    if (!emailAvailable) {
      return { error: "Email already in use" };
    }

    const passwordStrong = await verifyPasswordStrength(password);
    if (!passwordStrong) {
      return { error: "Password is too weak" };
    }

    const webInfo = await getIsContactWebEnabled(email);
    const { contactIDs, isWebEnabled } = webInfo;


    if (!isWebEnabled || contactIDs.length !== 1) {
      //If the contact is not web enabled or has none or multiple contacts, send a web request email
      await createUserRequest(
        email,
        password,
        language,
        firstName,
        lastName,
        company,
        phoneNumber,
        contactIDs
      );
      await sendWebRequestEmail({
        to: DEFAULT_MANAGER_INBOX,
        email,
        firstName,
        lastName,
        company,
      });
      return {
        status: "web-request-sent",
      };
    } else {
      //If the contact is web enabled, create a user and redirect to MFA enrollment
      const user = await createUser(
        email,
        password,
        contactIDs[0],
        language,
        isWebEnabled,
        dailyReportOptIn
      );
      // Store user ID and phone number for MFA verification
      const cookieStore = await cookies();
      cookieStore.set("pending_user_id", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });
      return redirect(`/auth/mfa/enroll?phoneNumber=${phoneNumber}`);
    }
  });
