import { NextResponse } from "next/server";
import { validateUnsubscribeToken } from "@/lib/reports/tokens";
import { usersLayout } from "@/server/auth/db/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/error?message=Invalid unsubscribe link", request.url)
    );
  }

  const userInfo = validateUnsubscribeToken(token);

  if (!userInfo) {
    return NextResponse.redirect(
      new URL("/auth/error?message=Invalid or expired unsubscribe link", request.url)
    );
  }

  try {
    // Find user record and update opt-in status
    const userRecord = await usersLayout.findOne({
      query: { id: `==${userInfo.userId}`, email: `==${userInfo.email}` },
    });

    await usersLayout.update({
      recordId: userRecord.data.recordId,
      fieldData: { dailyReportOptIn: 0 },
    });

    // Return success page
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <title>Unsubscribed</title>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Helvetica, Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 500px;
    }
    h1 { color: #171796; }
    p { color: #666; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Successfully Unsubscribed</h1>
    <p>You have been unsubscribed from daily booking reports.</p>
    <p>You will no longer receive these emails. You can re-enable them anytime from your profile settings.</p>
  </div>
</body>
</html>`,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("Error unsubscribing user:", error);
    return NextResponse.redirect(
      new URL("/auth/error?message=Failed to unsubscribe", request.url)
    );
  }
}

