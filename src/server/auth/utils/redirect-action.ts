"use server";

import { getRedirectCookie } from "./redirect";
import { redirect } from "next/navigation";

export async function redirectAction() {
  const redirectTo = await getRedirectCookie();
  return redirect(redirectTo);
}