"use server";

import { actionClient } from "@/server/safe-action";
import { loginSchema } from "./schema";
import { validateLogin } from "@/server/auth/utils/user";
import { generateSessionToken } from "@/server/auth/utils/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { sendVerificationCode } from "../mfa/mfa";

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput;
    const user = await validateLogin(email, password);

    if (user === null) {
      return { error: "Invalid email or password" };
    }

    if (!user.emailVerified) {
      return redirect("/auth/verify-email");
    }

    // TODO: Once phone_number is added to user table, check if it exists
    // For now, hardcode a test number for development
    const phoneNumber = "+17047715079"; // This should come from user.phone_number

    try {
      await sendVerificationCode(phoneNumber);

      // Store user ID and phone number for MFA verification
      const cookieStore = await cookies();
      cookieStore.set("pending_user_id", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });

      cookieStore.set("pending_phone_number", phoneNumber, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });

      return redirect("/auth/mfa");
    } catch (error) {
      if (error && (error as any).digest?.includes("NEXT_REDIRECT")) {
        throw error;
      }
      console.error("Error sending MFA code:", error);
      return { error: "Failed to send verification code" };
    }
  });
