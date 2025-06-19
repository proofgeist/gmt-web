import { AuthCodeEmail } from "@/emails/auth-code";
import { resend } from "../services/resend";
import { EMAIL_FROM } from "@/config/email";

export async function sendAuthEmail({
  to,
  code,
  type,
}: {
  to: string;
  code: string;
  type: "verification" | "password-reset";
}) {
  const subject =
    type === "verification" ? "Verify Your Email" : "Reset Your Password";

  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    react: <AuthCodeEmail validationCode={code} type={type} />,
  });

  return result;
}
