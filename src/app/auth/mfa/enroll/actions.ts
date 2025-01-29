"use server";

import { actionClient } from "@/server/safe-action";
import { mfaEnrollSchema } from "./schema";
import { getCurrentSession } from "@/server/auth/utils/session";
import { redirect } from "next/navigation";
import { updateUserPhoneNumber } from "@/server/auth/utils/user";
import { sendVerificationCodeAction } from "../actions";
import { cookies } from "next/headers";

export const mfaEnrollAction = actionClient
  .schema(mfaEnrollSchema)
  .action(async ({ parsedInput }) => {
    const cookieStore = await cookies();
    const pendingUserID = cookieStore.get("pending_user_id")?.value;

    if (!pendingUserID) {
      return { error: "No pending user found" };
    }


    const { phoneNumber } = parsedInput;

    try {
      await updateUserPhoneNumber(pendingUserID, phoneNumber);
      const result = await sendVerificationCodeAction({ phoneNumber });

      if (!result || "error" in result) {
        return { error: "Failed to send verification code: " + result?.error };
      }

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
      console.error("Error enrolling in MFA:", error);
      return { error: "Failed to enroll in MFA" };
    }
  });
