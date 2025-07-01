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
    "https://www.mygmt.com/"
  : "http://localhost:3000";

interface ActivatedEmailProps {
  name?: string;
}

export const ActivatedEmail = ({ name }: ActivatedEmailProps) => (
  <Html>
    <Head />
    <Body style={emailStyles.main}>
      <Container style={emailStyles.container}>
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
          <Link href={`${BASE_URL}/auth/login`} style={emailStyles.button}>
            Login to MyGMT
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
