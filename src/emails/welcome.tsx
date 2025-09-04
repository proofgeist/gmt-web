import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";
import { env } from "@/config/env";
import { emailStyles } from "./styles";

const BASE_URL =
  env.NODE_ENV === "production" ?
    "https://www.mygmt.com/"
  : "http://localhost:3000";

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
  <Html>
    <Head />
    <Body style={emailStyles.main}>
      <Container style={emailStyles.container}>
        <div style={emailStyles.brandingContainer}>
          <Text style={emailStyles.brandingMy}>my</Text>
          <Text style={emailStyles.brandingGMT}>GMT</Text>
        </div>
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
            href={`${BASE_URL}/auth/signup?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName ?? "")}&lastName=${encodeURIComponent(lastName ?? "")}&company=${encodeURIComponent(company ?? "")}&phoneNumber=${encodeURIComponent(phoneNumber ?? "")}`}
            style={emailStyles.button}
          >
            Create Your Account
          </Link>
        </Section>
        <Text style={emailStyles.paragraph}>
          If you did not request this invitation, you can safely ignore this
          email.
        </Text>
      </Container>
    </Body>
  </Html>
);

WelcomeEmail.PreviewProps = {
  name: "John Doe",
  email: "john.doe@example.com",
} as WelcomeEmailProps;

export default WelcomeEmail;
