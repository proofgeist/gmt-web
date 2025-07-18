import { HoldRemovedEmail } from "@/emails/hold-removed";
import { resend } from "@/server/services/resend";
import { EMAIL_FROM } from "@/config/email";
import { WebRequestEmail } from "@/emails/web-requests";

interface HoldRemovedEmailProps {
  to: string;
  firstName?: string;
  bookingNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  vesselName: string;
  holdRemovedAt: string;
}

export async function sendHoldRemovedEmail({
  to,
  firstName,
  bookingNumber,
  portOfLoading,
  portOfDischarge,
  vesselName,
  holdRemovedAt,
}: HoldRemovedEmailProps) {
  const subject = `Shipment Hold Removed for Booking #${bookingNumber}`;

  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    react: (
      <HoldRemovedEmail
        firstName={firstName}
        bookingNumber={bookingNumber}
        portOfLoading={portOfLoading}
        portOfDischarge={portOfDischarge}
        vesselName={vesselName}
        holdRemovedAt={holdRemovedAt}
      />
    ),
  });

  return result;
}


export async function sendWebRequestEmail({
  to,
  email,
  firstName,
  lastName,
  company,
}: {
  to: string | string[];
  email: string;
  firstName: string;
  lastName: string;
  company: string;
}) {
  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "New web request",
    react: (
      <WebRequestEmail
        email={email}
        firstName={firstName}
        lastName={lastName}
        company={company}
      />
    ),
  });

  return result;
}
