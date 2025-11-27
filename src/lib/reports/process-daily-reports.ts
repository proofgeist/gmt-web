import { getOptedInUsers } from "./users";
import { getUserActiveBookings } from "./queries";
import {
  prepareDailyReportEmail,
  sendDailyReportEmailsBatch,
} from "@/server/services/daily-report";

export type DailyReportResult = {
  message: string;
  emailsSent: number;
  usersProcessed: number;
  errors: number;
};

/**
 * Process daily reports for all opted-in users
 * This is the core logic shared between the cron route and admin action
 * Uses batch email sending to avoid rate limiting
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

  // Prepare all email data first
  const emailDataPromises = optedInUsers.map(async (user) => {
    try {
      // Get user's active bookings
      const bookings = await getUserActiveBookings(user);
      // Prepare email data (even if no bookings - user might want to know)
      return prepareDailyReportEmail(user, bookings);
    } catch (error) {
      console.error(`Error preparing email for ${user.email}:`, error);
      return null;
    }
  });

  // Wait for all email data to be prepared
  const emailDataArray = await Promise.all(emailDataPromises);
  // Filter out any null values (failed preparations)
  const validEmailData = emailDataArray.filter(
    (email): email is NonNullable<typeof email> => email !== null
  );

  if (validEmailData.length === 0) {
    return {
      message: "No valid emails to send",
      emailsSent: 0,
      usersProcessed: optedInUsers.length,
      errors: optedInUsers.length,
    };
  }

  // Send all emails in batches
  const { sent: emailsSent, errors: batchErrors } =
    await sendDailyReportEmailsBatch(validEmailData);

  // Log any errors
  if (batchErrors.length > 0) {
    console.error(
      `Batch sending errors: ${batchErrors.length} emails failed`,
      batchErrors
    );
  }

  return {
    message: "Daily report processing completed",
    emailsSent,
    usersProcessed: optedInUsers.length,
    errors: batchErrors.length + (optedInUsers.length - validEmailData.length),
  };
}

