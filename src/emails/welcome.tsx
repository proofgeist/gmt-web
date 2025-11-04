import { Heading, Section, Text, Link } from "@react-email/components";
import * as React from "react";
import { emailStyles } from "./styles";
import { EmailLayout } from "./components/EmailLayout";
import { EMAIL_BASE_URL } from "./config";

interface WelcomeEmailProps {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phoneNumber?: string;
}

export const WelcomeEmail = ({
  email,
  firstName,
  lastName,
  company,
  phoneNumber,
}: WelcomeEmailProps) => (
  <EmailLayout fullHeight={false}>
    <Heading style={emailStyles.secondary}>
      {firstName ? `Welcome ${firstName}!` : "Welcome!"}
    </Heading>
    <Text style={emailStyles.paragraph}>
      At <Link href="https://mygmt.com">MyGMT.com</Link>, you can manage all
      your shipments efficiently and securely.
    </Text>
    <Text style={emailStyles.paragraph}>
      To get started, please click the button below to create your account.
    </Text>
    <Section style={{ textAlign: "center", marginTop: "20px" }}>
      <Link
        href={`${EMAIL_BASE_URL}/auth/signup?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName ?? "")}&lastName=${encodeURIComponent(lastName ?? "")}&company=${encodeURIComponent(company ?? "")}&phoneNumber=${encodeURIComponent(phoneNumber ?? "")}`}
        style={emailStyles.button}
      >
        Create Your Account
      </Link>
    </Section>
    <Text style={emailStyles.paragraph}>
      If you did not request this invitation, you can safely ignore this email.
    </Text>
  </EmailLayout>
);

WelcomeEmail.PreviewProps = {
  name: "John Doe",
  email: "john.doe@example.com",
} as WelcomeEmailProps;

export default WelcomeEmail;
