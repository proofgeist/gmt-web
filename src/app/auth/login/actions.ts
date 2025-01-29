"use server";

import { actionClient } from "@/server/safe-action";
import { loginSchema } from "./schema";
import { validateLogin } from "@/server/auth/utils/user";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { sendVerificationCodeAction } from "../mfa/actions";

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput;
    const user = await validateLogin(email, password);

    if (user === null) {
      return { error: "Invalid email or password" };
    }
    console.log("user", user);

    const cookieStore = await cookies();
    cookieStore.set("pending_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });
    if (!user.phone_number_mfa) {
      redirect("/auth/mfa/enroll");
    }

    const phoneNumber = user.phone_number_mfa; // This should come from user.phone_number

    try {
      const result = await sendVerificationCodeAction({ phoneNumber });

      if (!result || "error" in result) {
        return { error: "Failed to send verification code: " + result?.error };
      }

      // Store user ID and phone number for MFA verification

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
