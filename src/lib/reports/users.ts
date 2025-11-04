import { usersLayout } from "@/server/auth/db/client";
import type { UserSession } from "@/server/auth/utils/session";

/**
 * Get all users who have opted in to daily reports
 * Returns users with their session data (webAccessType, reportReferenceCustomer)
 * @returns Array of UserSession objects for opted-in users
 */
export async function getOptedInUsers(): Promise<UserSession[]> {
  // Query users with dailyReportOptIn === 1 and active === 1
  const optedInUsers = await usersLayout.findAll({
    query: {
      dailyReportOptIn: "==1",
      active: "==1",
    },
  });

  const userSessions: UserSession[] = [];

  // Build UserSession objects from user data
  for (const userRecord of optedInUsers) {
    const userData = userRecord.fieldData;
    
    // Validate that user has required company data
    if (!userData["pka_company::reportReferenceCustomer"] || !userData["pka_company::webAccessType"]) {
      continue;
    }

    const userSession: UserSession = {
      id: userData.id,
      email: userData.email,
      emailVerified: Boolean(userData.emailVerified),
      username: userData.username,
      contact_id: userData.contact_id,
      reportReferenceCustomer: userData["pka_company::reportReferenceCustomer"],
      phone_number_mfa: userData.phone_number_mfa,
      webAccessType: userData["pka_company::webAccessType"],
      user_role: userData.user_role,
      preferredLanguage: userData.preferredLanguage,
    };

    userSessions.push(userSession);
  }

  return userSessions;
}

