import { createSafeActionClient } from "next-safe-action";
import { getCurrentSession } from "./auth/utils/session";

export const actionClient = createSafeActionClient();
export const authedActionClient = actionClient.use(async ({ next, ctx }) => {
  const { session, user } = await getCurrentSession();
  if (session === null) {
    throw new Error("Unauthorized");
  }

  return next({ ctx: { ...ctx, session, user } });
});
