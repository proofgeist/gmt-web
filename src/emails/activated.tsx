import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";
import { env } from "@/config/env";
import { emailStyles } from "./styles";

const BASE_URL =
  env.NODE_ENV === "production" ?
    "https://gmt-web.vercel.app/"
  : "http://localhost:3000";

interface ActivatedEmailProps {
  name?: string;
}

export const ActivatedEmail = ({ name }: ActivatedEmailProps) => (
  <Html>
    <Head />
    <Body style={emailStyles.main}>
      <Container style={emailStyles.container}>
        <Img
          src="https://gmt-web.vercel.app/gmt_logo.png"
          width="238"
          height="175"
          alt="Global Marine"
          style={emailStyles.logo}
        />
        <Text style={emailStyles.tertiary}>Welcome to Global Marine</Text>
        <Heading style={emailStyles.secondary}>
          {name ? `Hello ${name}!` : "Hello!"}
        </Heading>
        <Text style={emailStyles.paragraph}>
          We&apos;re excited to have you join Global Marine. Our platform helps
          you manage your shipments efficiently and securely. manage your
          shipments efficiently and securely.
        </Text>
        <Text style={emailStyles.paragraph}>
          Your account has been activated. You can now login to the platform.
        </Text>
        <Section style={{ textAlign: "center", marginTop: "20px" }}>
          <Link
            href={`${BASE_URL}/login`}
            style={emailStyles.button}
          >
            Login to Global Marine
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

ActivatedEmail.PreviewProps = {
  name: "John Doe",
} as ActivatedEmailProps;

export default ActivatedEmail;
