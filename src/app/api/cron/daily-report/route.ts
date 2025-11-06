import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { getOptedInUsers } from "@/lib/reports/users";
import { getUserActiveBookings } from "@/lib/reports/queries";
import { sendDailyReportEmail } from "@/server/services/daily-report";

export async function GET(request: Request) {
  // Check for Vercel cron header (automatically added by Vercel cron jobs)
  const vercelCronHeader = request.headers.get("x-vercel-cron");
  const authHeader = request.headers.get("Authorization");

  // Require Bearer token authentication
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing authentication" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  // If it's a Vercel cron job, verify CRON_SECRET
  // Otherwise, verify OTTO_API_KEY (for manual/admin calls)
  if (vercelCronHeader === "1") {
    // Vercel cron job - must use CRON_SECRET
    if (token !== env.CRON_SECRET) {
      return NextResponse.json(
        { error: "Invalid cron secret" },
        { status: 401 }
      );
    }
  } else {
    // Manual/admin call - must use OTTO_API_KEY
    if (token !== env.OTTO_API_KEY) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }
  }

  try {
    // Get all opted-in users
    const optedInUsers = await getOptedInUsers();

    if (optedInUsers.length === 0) {
      return NextResponse.json({
        message: "No opted-in users found",
        emailsSent: 0,
        usersProcessed: 0,
      });
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

    return NextResponse.json({
      message: "Daily report processing completed",
      emailsSent,
      usersProcessed: optedInUsers.length,
      errors,
    });
  } catch (error) {
    console.error("Error processing daily reports:", error);
    return NextResponse.json(
      { error: "Error processing daily reports" },
      { status: 500 }
    );
  }
}

