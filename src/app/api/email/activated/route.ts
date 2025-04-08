import { NextResponse } from "next/server";
import { resend } from "@/server/services/resend";
import { z } from "zod";
import { ReactElement } from "react";
import { env } from "@/config/env";
import { EMAIL_FROM } from "@/config/email";
import { ActivatedEmail } from "@/emails/activated";
const activatedEmailSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

type ActivatedEmailProps = z.infer<typeof activatedEmailSchema>;

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
    const body = (await request.json()) as ActivatedEmailProps;
    const { email, name } = activatedEmailSchema.parse(body);

    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Your account has been activated",
      react: ActivatedEmail({ name }) as ReactElement,
    });

    return NextResponse.json(
      { message: "Activated email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    console.error("Error sending activated email:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
