"use server";

import { actionClient } from "@/server/safe-action";
import { getOptedInUsers } from "@/lib/reports/users";
import { getUserActiveBookings } from "@/lib/reports/queries";
import { sendDailyReportEmail } from "@/server/services/daily-report";
import { z } from "zod";

export const testDailyReportAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    try {
      // Get all opted-in users
      const optedInUsers = await getOptedInUsers();

      if (optedInUsers.length === 0) {
        return {
          success: true,
          message: "No opted-in users found",
          emailsSent: 0,
          usersProcessed: 0,
          errors: 0,
        };
      }

      let emailsSent = 0;
      let errors = 0;
      const errorDetails: string[] = [];

      // Process each user
      for (const user of optedInUsers) {
        try {
          // Get user's active bookings
          const bookings = await getUserActiveBookings(user);

          // Send email (even if no bookings - user might want to know)
          await sendDailyReportEmail(user, bookings);
          emailsSent++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.error(`Error sending email to ${user.email}:`, error);
          errors++;
          errorDetails.push(`${user.email}: ${errorMessage}`);
        }
      }

      return {
        success: true,
        message: "Daily report processing completed",
        emailsSent,
        usersProcessed: optedInUsers.length,
        errors,
        errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
      };
    } catch (error) {
      console.error("Error processing daily reports:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error processing daily reports",
        emailsSent: 0,
        usersProcessed: 0,
        errors: 0,
      };
    }
  });

