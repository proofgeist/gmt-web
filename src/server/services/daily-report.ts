import { resend } from "@/server/services/resend";
import { DailyReportEmail } from "@/emails/daily-report";
import { ReactElement } from "react";
import { DEFAULT_FROM_EMAIL } from "@/config/email";
import type { UserSession } from "@/server/auth/utils/session";
import type { TBookings } from "@/config/schemas/filemaker/Bookings";
import { generateUnsubscribeToken } from "@/lib/reports/tokens";
import dayjs from "dayjs";

/**
 * Send daily report email to a user
 * @param user - The user session with email and user info
 * @param bookings - Array of active bookings for the user
 */
export async function sendDailyReportEmail(
  user: UserSession,
  bookings: TBookings[]
): Promise<void> {
  // Skip sending if user has no bookings (optional - uncomment if you want to skip)
  // if (bookings.length === 0) {
  //   return;
  // }

  const unsubscribeToken = generateUnsubscribeToken(user.id, user.email);
  const today = dayjs().format("MMMM D, YYYY");

  // Extract first name from email or username if available
  const userName = user.username ? user.username.split(" ")[0] : undefined;

  await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to: user.email,
    subject: `Your Daily Booking Report - ${today}`,
    react: DailyReportEmail({
      userName,
      bookings,
      unsubscribeToken,
    }) as ReactElement,
  });
}

