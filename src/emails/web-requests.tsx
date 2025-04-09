import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { emailStyles } from "./styles";

interface WebRequestEmailProps {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
}

export const WebRequestEmail = ({
  firstName,
  lastName,
  company,
}: WebRequestEmailProps) => (
  <Html>
    <Head />
    <Body style={emailStyles.main}>
      <Container style={emailStyles.container}>
        <Img
          src="https://gmt-web.vercel.app/gmt_logo-sticker.png"
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
