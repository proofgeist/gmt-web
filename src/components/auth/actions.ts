"use server";

import {
  getCurrentSession,
  invalidateSession,
} from "@/server/auth/utils/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function currentSessionAction() {
  try {
    return await getCurrentSession();
  } catch (error) {
    // If the error is about account configuration, return it as a structured error
    if (
      error instanceof Error &&
      error.message.includes("ACCOUNT_NOT_CONFIGURED")
    ) {
      throw error;
    }
    // For other errors, return null session
    return { session: null, user: null };
  }
}

export async function logoutAction() {
  const { session } = await currentSessionAction();
  if (session) {
    await invalidateSession(session.id);
  }
  (await cookies()).delete("email_verification");
  redirect("/");
}
