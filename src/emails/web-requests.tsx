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
  : "https://gmt-web.vercel.app/";

interface WebRequestEmailProps {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
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

export const WebRequestEmail = ({
  email,
  firstName,
  lastName,
  company,
}: WebRequestEmailProps) => (
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
        <Heading style={emailStyles.secondary}>New web request</Heading>
        <Section style={emailStyles.paragraph}>
          <Text style={emailStyles.paragraph}>
            New web request from {firstName} {lastName} of {company}
          </Text>
        </Section>
        <Section style={emailStyles.paragraph}>
          <Text style={emailStyles.paragraph}>
            Log in to FileMaker Pro to approve or deny the request.
          </Text>
        </Section>

        <Text style={emailStyles.paragraph}>
          If you did not request this code, you can ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

WebRequestEmail.PreviewProps = {
  email: "test@test.com",
  firstName: "John",
  lastName: "Doe",
  company: "Global Marine",
} as WebRequestEmailProps;

export default WebRequestEmail;
