import { HoldRemovedEmail } from "@/emails/hold-removed";
import { resend } from "@/server/services/resend";
import { DEFAULT_FROM_EMAIL, DEFAULT_SIGNUP_EMAIL } from "@/config/email";
import { WebRequestEmail } from "@/emails/web-requests";
import HoldRequestedEmail from "@/emails/hold-requested";

interface HoldRemovedEmailProps {
  to: string;
  firstName?: string;
  bookingNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  vesselName: string;
  holdRemovedAt: string;
}

interface HoldRequestedEmailProps {
  to: string;
  bookingNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  vesselName: string;
}

export async function sendHoldRemovedEmail({
  to,
  bookingNumber,
  portOfLoading,
  portOfDischarge,
  vesselName,
  holdRemovedAt,
}: HoldRemovedEmailProps) {
  const subject = `Shipment Hold Removed for Booking #${bookingNumber}`;

  const result = await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to,
    subject,
    react: (
      <HoldRemovedEmail
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

export async function sendShipperHoldRequestedEmail({
  to,
  bookingNumber,
  portOfLoading,
  portOfDischarge,
  vesselName,
}: HoldRequestedEmailProps) {
  console.log("sending email to", to);
  const subject = `Shipper Hold Requested for Booking #${bookingNumber}`;
  const result = await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to,
    subject,
    react: (
      <HoldRequestedEmail
        bookingNumber={bookingNumber}
        portOfLoading={portOfLoading}
        portOfDischarge={portOfDischarge}
        vesselName={vesselName}
      />
    ),
  });
  console.log("email sent");
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
    from: DEFAULT_SIGNUP_EMAIL,
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
