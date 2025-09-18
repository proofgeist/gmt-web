import { resend } from "@/server/services/resend";
import { DEFAULT_SIGNUP_EMAIL } from "@/config/email";
import InquiryEmail from "@/emails/inquiry";
export async function sendContactEmail({
  to,
  email,
  firstName,
  lastName,
  companyName,
  message,
  cell,
}: {
  to: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  message: string;
  cell: string;
}) {
  await resend.emails.send({
    from: DEFAULT_SIGNUP_EMAIL,
    to,
    subject: "New Contact Inquiry",
    react: InquiryEmail({
      email,
      firstName,
      lastName,
      companyName,
      message,
      cell,
    }),
  });
}
