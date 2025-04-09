import { resend } from "@/server/services/resend";
import { EMAIL_FROM } from "@/config/email";
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
    from: EMAIL_FROM,
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
