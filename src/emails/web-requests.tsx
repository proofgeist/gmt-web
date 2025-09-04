import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
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

// Styles for the web request email table
const webRequestStyles = {
  table: {
    width: "80%",
    borderCollapse: "collapse" as const,
    margin: "20px auto",
  },
  row: {
    borderBottom: "1px solid #eee",
  },
  cell: {
    padding: "12px 20px",
    textAlign: "left" as const,
    color: "#444",
    fontSize: "14px",
    fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  },
  label: {
    fontWeight: "600",
    width: "30%",
    verticalAlign: "top" as const,
  },
  value: {
    width: "70%",
  },
  actionText: {
    backgroundColor: "#f8f9fa",
    padding: "16px",
    borderRadius: "6px",
    margin: "24px 0",
    color: "#444",
    fontSize: "14px",
    textAlign: "center" as const,
  },
};

export const WebRequestEmail = ({
  firstName,
  lastName,
  company,
}: WebRequestEmailProps) => (
  <Html>
    <Head />
    <Body style={emailStyles.main}>
      <Container style={emailStyles.container}>
        <div style={emailStyles.brandingContainer}>
          <Text style={emailStyles.brandingMy}>my</Text>
          <Text style={emailStyles.brandingGMT}>GMT</Text>
        </div>

        <Text style={emailStyles.tertiary}>Global Marine Web</Text>
        <Heading style={emailStyles.secondary}>New Web Access Request</Heading>

        <table style={webRequestStyles.table}>
          <tbody>
            <tr style={webRequestStyles.row}>
              <td
                style={{ ...webRequestStyles.cell, ...webRequestStyles.label }}
              >
                Name
              </td>
              <td
                style={{ ...webRequestStyles.cell, ...webRequestStyles.value }}
              >
                {firstName} {lastName}
              </td>
            </tr>
            <tr style={webRequestStyles.row}>
              <td
                style={{ ...webRequestStyles.cell, ...webRequestStyles.label }}
              >
                Company
              </td>
              <td
                style={{ ...webRequestStyles.cell, ...webRequestStyles.value }}
              >
                {company}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={webRequestStyles.actionText}>
          Please log in to FileMaker Pro to review and process this request.
        </div>

        <Text
          style={{ ...emailStyles.paragraph, color: "#666", fontSize: "13px" }}
        >
          If you did not expect this request, you can safely ignore this email.
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
