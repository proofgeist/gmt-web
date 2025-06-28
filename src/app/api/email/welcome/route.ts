import { NextResponse } from "next/server";
import { resend } from "@/server/services/resend";
import { WelcomeEmail } from "@/emails/welcome";
import { z } from "zod";
import { ReactElement } from "react";
import { env } from "@/config/env";
import { EMAIL_FROM } from "@/config/email";

const welcomeEmailSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type WelcomeEmailProps = z.infer<typeof welcomeEmailSchema>;

export async function POST(request: Request) {
  // Check for valid authentication
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing bearer token" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  if (token !== env.OTTO_API_KEY) {
    return NextResponse.json(
      { error: "Invalid authentication token" },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as WelcomeEmailProps;
    const { email, firstName, lastName, company, phoneNumber } = welcomeEmailSchema.parse(body);

    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Welcome to Global Marine",
      react: WelcomeEmail({ email, firstName, lastName, company, phoneNumber }) as ReactElement,
    });

    return NextResponse.json(
      { message: "Welcome email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    console.error("Error sending welcome email:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
