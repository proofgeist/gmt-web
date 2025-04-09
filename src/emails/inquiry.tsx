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

interface InquiryEmailProps {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  message: string;
  cell: string;
}

export const InquiryEmail = ({
  email,
  firstName,
  lastName,
  companyName,
  message,
  cell,
}: InquiryEmailProps) => (
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
        <Text style={emailStyles.tertiary}>Global Marine Web</Text>
        <Heading style={emailStyles.secondary}>New Contact Inquiry</Heading>
        <Text style={emailStyles.paragraph}>
          We&apos;ve received a new contact inquiry from {firstName} {lastName}{" "}
          of {companyName}.
        </Text>
        <Section style={{ textAlign: "center", marginTop: "20px" }}>
          <Text style={emailStyles.paragraph}>
            Name: {firstName} {lastName}
          </Text>
          <Text style={emailStyles.paragraph}>Company: {companyName}</Text>
          <Text style={emailStyles.paragraph}>Email: {email}</Text>
          <Text style={emailStyles.paragraph}>Phone: {cell}</Text>
          <Text style={emailStyles.paragraph}>Message: {message}</Text>
        </Section>
        <Text style={emailStyles.paragraph}>Log into FileMaker to reply</Text>
      </Container>
    </Body>
  </Html>
);

InquiryEmail.PreviewProps = {
  email: "test@test.com",
  firstName: "John",
  lastName: "Doe",
  companyName: "Global Marine",
  message: "This is a test message",
  cell: "1234567890",
} as InquiryEmailProps;

export default InquiryEmail;
