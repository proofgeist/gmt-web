import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { processDailyReports } from "@/lib/reports/process-daily-reports";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing authentication" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  // Verify CRON_SECRET
  if (token !== env.CRON_SECRET) {
    return NextResponse.json(
      { error: "Invalid cron secret" },
      { status: 401 }
    );
  }

  try {
    const result = await processDailyReports();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing daily reports:", error);
    return NextResponse.json(
      { error: "Error processing daily reports" },
      { status: 500 }
    );
  }
}

