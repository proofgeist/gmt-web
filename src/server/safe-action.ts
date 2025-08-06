import { createSafeActionClient } from "next-safe-action";
import { getCurrentSession } from "./auth/utils/session";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    throw error;
  },
});
export const authedActionClient = actionClient.use(async ({ next, ctx }) => {
  const { session, user } = await getCurrentSession();
  if (session === null) {
    throw new Error("Unauthorized");
  }
  if (!user?.reportReferenceCustomer) {
    throw new Error("Missing Report Reference Customer");
  }

  return next({ ctx: { ...ctx, session, user } });
});
