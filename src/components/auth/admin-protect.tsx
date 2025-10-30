import {
  getCurrentSession,
  invalidateSession,
} from "@/server/auth/utils/session";
import AuthRedirect from "./redirect";

/**
 * This server component will protect admin routes from users who aren't admins
 * It will redirect to the dashboard if the user is not an admin
 */
export default async function AdminProtect({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, user } = await getCurrentSession();
  
  if (!session) {
    return <AuthRedirect path="/auth/login" />;
  }
  
  if (!user?.reportReferenceCustomer) {
    await invalidateSession(session.id);
    return (
      <AuthRedirect
        path={`/auth/login?error=Missing Report Reference Number. Contact an admin for assistance.`}
      />
    );
  }

  if (user.user_role !== "admin") {
    return <AuthRedirect path="/dashboard?error=Access denied. Admin privileges required." />;
  }

  return <>{children}</>;
}
