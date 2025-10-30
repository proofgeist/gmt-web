import { createSafeActionClient } from "next-safe-action";
import { getCurrentSession } from "./auth/utils/session";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    // Log the actual error for debugging (server-side only)
    console.error("Server action error:", error);
    
    // Return a generic error message to the client
    return "An unexpected error occurred. Please try again.";
  },
});
export const authedActionClient = actionClient.use(async ({ next, ctx }) => {
  const { session, user } = await getCurrentSession();
  if (session === null) {
    throw new Error("Unauthorized");
  }
  if (!user?.reportReferenceCustomer) {
    throw new Error("Account configuration required");
  }

  return next({ ctx: { ...ctx, session, user } });
});
