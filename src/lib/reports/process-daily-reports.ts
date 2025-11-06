import { getOptedInUsers } from "./users";
import { getUserActiveBookings } from "./queries";
import { sendDailyReportEmail } from "@/server/services/daily-report";

export type DailyReportResult = {
  message: string;
  emailsSent: number;
  usersProcessed: number;
  errors: number;
};

/**
 * Process daily reports for all opted-in users
 * This is the core logic shared between the cron route and admin action
 */
export async function processDailyReports(): Promise<DailyReportResult> {
  // Get all opted-in users
  const optedInUsers = await getOptedInUsers();

  if (optedInUsers.length === 0) {
    return {
      message: "No opted-in users found",
      emailsSent: 0,
      usersProcessed: 0,
      errors: 0,
    };
  }

  let emailsSent = 0;
  let errors = 0;

  // Process each user
  for (const user of optedInUsers) {
    try {
      // Get user's active bookings
      const bookings = await getUserActiveBookings(user);

      // Send email (even if no bookings - user might want to know)
      await sendDailyReportEmail(user, bookings);
      emailsSent++;
    } catch (error) {
      console.error(`Error sending email to ${user.email}:`, error);
      errors++;
      // Continue processing other users even if one fails
    }
  }

  return {
    message: "Daily report processing completed",
    emailsSent,
    usersProcessed: optedInUsers.length,
    errors,
  };
}

