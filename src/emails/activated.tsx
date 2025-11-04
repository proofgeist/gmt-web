import { Heading, Section, Text, Link } from "@react-email/components";
import * as React from "react";
import { emailStyles } from "./styles";
import { EmailLayout } from "./components/EmailLayout";
import { EMAIL_BASE_URL } from "./config";

interface ActivatedEmailProps {
  name?: string;
}

export const ActivatedEmail = ({ name }: ActivatedEmailProps) => (
  <EmailLayout fullHeight={false}>
    <Heading style={emailStyles.secondary}>
      {name ? `Welcome ${name}!` : "Welcome!"}
    </Heading>
    <Text style={emailStyles.paragraph}>
      At <Link href="https://mygmt.com">MyGMT.com</Link>, you can manage all
      your shipments efficiently and securely.
    </Text>
    <Text style={emailStyles.paragraph}>
      Your account has been activated. You can now login to the platform.
    </Text>
    <Section style={{ textAlign: "center", marginTop: "20px" }}>
      <Link href={`${EMAIL_BASE_URL}/auth/login`} style={emailStyles.button}>
        Login to MyGMT
      </Link>
    </Section>
    <Text style={emailStyles.paragraph}>
      If you did not request this invitation, you can safely ignore this email.
    </Text>
  </EmailLayout>
);

ActivatedEmail.PreviewProps = {
  name: "John Doe",
} as ActivatedEmailProps;

export default ActivatedEmail;
