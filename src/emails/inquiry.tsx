import { Heading, Text } from "@react-email/components";
import * as React from "react";
import { emailStyles } from "./styles";
import { EmailLayout } from "./components/EmailLayout";

interface InquiryEmailProps {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  message: string;
  cell: string;
}

// Additional styles for the inquiry email table
const inquiryStyles = {
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    margin: "20px 0",
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
};

export const InquiryEmail = ({
  email,
  firstName,
  lastName,
  companyName,
  message,
  cell,
}: InquiryEmailProps) => (
  <EmailLayout fullHeight={false}>
    <Text style={emailStyles.tertiary}>Global Marine Web</Text>
    <Heading style={emailStyles.secondary}>New Contact Inquiry</Heading>

    <table style={inquiryStyles.table}>
      <tbody>
        <tr style={inquiryStyles.row}>
          <td style={{ ...inquiryStyles.cell, ...inquiryStyles.label }}>
            Name
          </td>
          <td style={{ ...inquiryStyles.cell, ...inquiryStyles.value }}>
            {firstName} {lastName}
          </td>
        </tr>
        <tr style={inquiryStyles.row}>
          <td style={{ ...inquiryStyles.cell, ...inquiryStyles.label }}>
            Company
          </td>
          <td style={{ ...inquiryStyles.cell, ...inquiryStyles.value }}>
            {companyName}
          </td>
        </tr>
        <tr style={inquiryStyles.row}>
          <td style={{ ...inquiryStyles.cell, ...inquiryStyles.label }}>
            Email
          </td>
          <td style={{ ...inquiryStyles.cell, ...inquiryStyles.value }}>
            {email}
          </td>
        </tr>
        <tr style={inquiryStyles.row}>
          <td style={{ ...inquiryStyles.cell, ...inquiryStyles.label }}>
            Phone
          </td>
          <td style={{ ...inquiryStyles.cell, ...inquiryStyles.value }}>
            {cell}
          </td>
        </tr>
        <tr style={inquiryStyles.row}>
          <td style={{ ...inquiryStyles.cell, ...inquiryStyles.label }}>
            Message
          </td>
          <td
            style={{
              ...inquiryStyles.cell,
              ...inquiryStyles.value,
            }}
          >
            {message}
          </td>
        </tr>
      </tbody>
    </table>

    <Text style={{ ...emailStyles.paragraph, marginTop: "20px" }}>
      To respond to this inquiry, please log into FileMaker.
    </Text>
  </EmailLayout>
);

InquiryEmail.PreviewProps = {
  email: "test@test.com",
  firstName: "John",
  lastName: "Doe",
  companyName: "Global Marine",
  message:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  cell: "1234567890",
} as InquiryEmailProps;

export default InquiryEmail;
