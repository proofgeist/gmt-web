import { cookies } from "next/headers";
import { DEFAULT_REDIRECT_URL } from "@/config/constant";
export async function getRedirectCookie() {
  const cookieStore = await cookies();
  const redirectTo = cookieStore.get("redirectTo")?.value;
  cookieStore.delete("redirectTo");
  return redirectTo ?? DEFAULT_REDIRECT_URL;
}
