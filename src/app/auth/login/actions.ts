"use server";

import { actionClient } from "@/server/safe-action";
import { loginSchema } from "./schema";
import { setPendingPhoneNumber, setPendingUserId, validateLogin } from "@/server/auth/utils/user";
import { redirect } from "next/navigation";
import { sendVerificationCodeAction } from "../mfa/actions";
import {
  getDeviceToken,
  parseDeviceToken,
} from "@/server/auth/utils/device-token";
import { verifyDeviceTokenAction } from "../mfa/verify-device-token";

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput;
    const user = await validateLogin(email, password);

    if (user === null) {
      return { error: "Invalid email or password" };
    }

    const deviceToken = await getDeviceToken();

    // Parse and validate the device token
    if (deviceToken) {
      const parsedToken = parseDeviceToken(deviceToken);
      if (parsedToken && parsedToken.userId === user.id) {
        await verifyDeviceTokenAction({ pendingUserId: user.id });
      }
    }

    await setPendingUserId(user.id);

    if (!user.phone_number_mfa) {
      redirect("/auth/mfa/enroll");
    }

    const phoneNumber = user.phone_number_mfa; // This should come from user.phone_number

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

      // Store user ID and phone number for MFA verification
      await setPendingPhoneNumber(phoneNumber);

      return redirect("/auth/mfa");
    } catch (error) {
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        throw error;
      }
      return { error: "Failed to send verification code" };
    }
  });
