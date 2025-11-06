"use server";

import { actionClient } from "@/server/safe-action";
import { env } from "@/config/env";
import { z } from "zod";

type RouteResponse =
  | {
    message: string;
    emailsSent: number;
    usersProcessed: number;
    errors?: number;
  }
  | {
    error: string;
  };

export const testDailyReportAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    try {
      // Construct the internal API URL
      const baseUrl =
        env.NODE_ENV === "production"
          ? process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "https://www.mygmt.com"
          : "http://localhost:3000";

      const url = `${baseUrl}/api/cron/daily-report`;

      // Call the route with proper authentication
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${env.OTTO_API_KEY}`,
        },
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as RouteResponse;
        const errorMessage =
          "error" in errorData ? errorData.error : `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = (await response.json()) as RouteResponse;

      // Check if response contains an error
      if ("error" in data) {
        throw new Error(data.error);
      }

      // Transform the route response to match the action's expected format
      return {
        success: true,
        message: data.message || "Daily report processing completed",
        emailsSent: data.emailsSent ?? 0,
        usersProcessed: data.usersProcessed ?? 0,
        errors: data.errors ?? 0,
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

