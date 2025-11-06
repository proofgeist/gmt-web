"use server";

import { actionClient } from "@/server/safe-action";
import { processDailyReports } from "@/lib/reports/process-daily-reports";
import { z } from "zod";

export const testDailyReportAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    try {
      const result = await processDailyReports();
      return {
        success: true,
        message: result.message,
        emailsSent: result.emailsSent,
        usersProcessed: result.usersProcessed,
        errors: result.errors,
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

