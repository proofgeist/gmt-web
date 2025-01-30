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

interface AuthCodeEmailProps {
  validationCode: string;
  type: "verification" | "password-reset";
}

// Additional styles specific to auth code email
const authCodeStyles = {
  codeContainer: {
    background: "rgba(0,0,0,.05)",
    borderRadius: "4px",
    margin: "16px auto 14px",
    verticalAlign: "middle",
    width: "280px",
  },

  code: {
    color: "#000",
    display: "inline-block",
    fontFamily: "HelveticaNeue-Bold",
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: "6px",
    lineHeight: "40px",
    paddingBottom: "8px",
    paddingTop: "8px",
    margin: "0 auto",
    width: "100%",
    textAlign: "center" as const,
  },
};

export const AuthCodeEmail = ({ validationCode, type }: AuthCodeEmailProps) => (
  <Html>
    <Head />
    <Body style={emailStyles.main}>
      <Container style={emailStyles.container}>
        <Img
          // TODO: Replace with your logo
          src="https://gmt-web.vercel.app/gmt_logo.png"
          width="238"
          height="175"
          alt="Global Marine"
          style={emailStyles.logo}
        />
        <Text style={emailStyles.tertiary}>
          {type === "verification" ?
            "Verify Your Email"
          : "Reset Your Password"}
        </Text>
        <Heading style={emailStyles.secondary}>
          Enter the following code to{" "}
          {type === "verification" ?
            "verify your email"
          : "reset your password"}
        </Heading>
        <Section style={authCodeStyles.codeContainer}>
          <Text style={authCodeStyles.code}>{validationCode}</Text>
        </Section>
        {type === "verification" && (
          <Section style={{ textAlign: "center", marginTop: "20px" }}>
            <Link
              href={`${BASE_URL}/auth/verify-email?code=${validationCode}`}
              style={emailStyles.button}
            >
              Click to Verify Email
            </Link>
          </Section>
        )}
        <Text style={emailStyles.paragraph}>
          If you did not request this code, you can ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

AuthCodeEmail.PreviewProps = {
  validationCode: "D7CU4GOV",
  type: "verification",
} as AuthCodeEmailProps;

export default AuthCodeEmail;