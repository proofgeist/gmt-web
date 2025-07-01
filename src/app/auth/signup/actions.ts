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
    } = parsedInput;
    const emailAvailable = await checkEmailAvailability(email);
    if (!emailAvailable) {
      return { error: "Email already in use" };
    }

    const passwordStrong = await verifyPasswordStrength(password);
    if (!passwordStrong) {
      return { error: "Password is too weak" };
    }

    const webInfo = await getIsContactWebEnabled(email).catch(async () => {
      return {
        status: "no-user",
      };
    });

    // If webInfo is a status object, return it immediately
    if (webInfo && "status" in webInfo) {
      await createUserRequest(
        email,
        password,
        language,
        firstName,
        lastName,
        company,
        phoneNumber
      );

      return webInfo;
    }

    const { contactID, isWebEnabled, hasMultipleContacts } = webInfo;

    //If the contact is web enabled, create a user and redirect to MFA enrollment
    if (isWebEnabled) {
      const user = await createUser(
        email,
        password,
        contactID,
        language,
        isWebEnabled
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
    } else {
      //If the contact is not web enabled, send a web request email
      await createUserRequest(
        email,
        password,
        language,
        firstName,
        lastName,
        company,
        phoneNumber,
        contactID
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
    }
  });
