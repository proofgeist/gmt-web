import { resend } from "@/server/services/resend";
import { DailyReportEmail } from "@/emails/daily-report";
import { ReactElement } from "react";
import { DEFAULT_FROM_EMAIL } from "@/config/email";
import type { UserSession } from "@/server/auth/utils/session";
import type { TBookings } from "@/config/schemas/filemaker/Bookings";
import { generateUnsubscribeToken } from "@/lib/reports/tokens";
import dayjs from "dayjs";

/**
 * Prepare daily report email data for a user (without sending)
 * @param user - The user session with email and user info
 * @param bookings - Array of active bookings for the user
 * @returns Email data object ready for batch sending
 */
export function prepareDailyReportEmail(
  user: UserSession,
  bookings: TBookings[]
): {
  from: string;
  to: string;
  subject: string;
  react: ReactElement;
} {
  const unsubscribeToken = generateUnsubscribeToken(user.id, user.email);
  const today = dayjs().format("MMMM D, YYYY");

  // Extract first name from email or username if available
  const userName = user.username ? user.username.split(" ")[0] : undefined;

  return {
    from: DEFAULT_FROM_EMAIL,
    to: user.email,
    subject: `Your Daily Booking Report - ${today}`,
    react: DailyReportEmail({
      userName,
      bookings,
      unsubscribeToken,
    }) as ReactElement,
  };
}

/**
 * Send daily report email to a user (legacy function for backward compatibility)
 * @param user - The user session with email and user info
 * @param bookings - Array of active bookings for the user
 * @deprecated Use batch sending via sendDailyReportEmailsBatch instead
 */
export async function sendDailyReportEmail(
  user: UserSession,
  bookings: TBookings[]
): Promise<void> {
  const emailData = prepareDailyReportEmail(user, bookings);
  await resend.emails.send(emailData);
}

/**
 * Send daily report emails in batches using Resend batch API
 * @param emails - Array of email data objects to send
 * @returns Object with success count and errors
 */
export async function sendDailyReportEmailsBatch(
  emails: Array<{
    from: string;
    to: string;
    subject: string;
    react: ReactElement;
  }>
): Promise<{ sent: number; errors: Array<{ index: number; message: string }> }> {
  if (emails.length === 0) {
    return { sent: 0, errors: [] };
  }

  const BATCH_SIZE = 100; // Resend's maximum batch size
  let totalSent = 0;
  const allErrors: Array<{ index: number; message: string }> = [];

  // Process emails in batches of 100
  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    const batchStartIndex = i;

    try {
      // Use batch.send API
      // In strict mode (default), entire batch fails if any email is invalid
      // In permissive mode (via header), partial success is allowed
      const result = await resend.batch.send(batch);

      if (result.error) {
        // Entire batch failed (strict mode or API error)
        console.error(
          `Error sending batch starting at index ${batchStartIndex}:`,
          result.error
        );
        const errorMessage =
          result.error.message || "Unknown batch error";
        for (let j = 0; j < batch.length; j++) {
          allErrors.push({
            index: batchStartIndex + j,
            message: errorMessage,
          });
        }
      } else if (result.data?.data) {
        // Batch succeeded - count successful emails
        const successfulEmails = result.data.data;
        totalSent += successfulEmails.length;

        // If batch size doesn't match sent count, some emails failed
        // This can happen in permissive mode or if API returns partial success
        if (successfulEmails.length < batch.length) {
          const failedCount = batch.length - successfulEmails.length;
          for (let j = 0; j < failedCount; j++) {
            allErrors.push({
              index: batchStartIndex + successfulEmails.length + j,
              message: "Email failed validation or was rejected",
            });
          }
        }
      }
    } catch (error) {
      // Unexpected error - mark all emails in batch as errors
      console.error(
        `Unexpected error sending batch starting at index ${batchStartIndex}:`,
        error
      );
      for (let j = 0; j < batch.length; j++) {
        allErrors.push({
          index: batchStartIndex + j,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  }

  return { sent: totalSent, errors: allErrors };
}

