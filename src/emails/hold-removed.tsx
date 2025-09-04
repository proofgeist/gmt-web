import {
  Body,
  Button,
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

interface HoldRemovedEmailProps {
  firstName?: string;
  bookingNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  vesselName: string;
  holdRemovedAt: string;
}

const detailRowStyle = {
  row: {
    borderBottom: "1px solid #eee",
  },
  cell: {
    padding: "8px 20px",
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
  table: {
    width: "90%",
    borderCollapse: "collapse" as const,
    margin: "20px auto",
  },
};

export const HoldRemovedEmail = ({
  bookingNumber,
  portOfLoading,
  portOfDischarge,
  vesselName,
  holdRemovedAt,
}: HoldRemovedEmailProps) => (
  <Html>
    <Head />
    <Body style={emailStyles.main}>
      <Container style={emailStyles.container}>
        <Text style={emailStyles.tertiary}>Shipment Notification</Text>
        <Heading style={emailStyles.secondary}>Shipment Hold Removed</Heading>
        <Text style={emailStyles.paragraph}>
          This email is to notify you that a hold on the shipment detailed below
          was removed on {holdRemovedAt}.
        </Text>

        <Section>
          <table style={detailRowStyle.table}>
            <tbody>
              <tr style={detailRowStyle.row}>
                <td style={{ ...detailRowStyle.cell, ...detailRowStyle.label }}>
                  Booking #
                </td>
                <td style={{ ...detailRowStyle.cell, ...detailRowStyle.value }}>
                  {bookingNumber}
                </td>
              </tr>
              <tr style={detailRowStyle.row}>
                <td style={{ ...detailRowStyle.cell, ...detailRowStyle.label }}>
                  Vessel
                </td>
                <td style={{ ...detailRowStyle.cell, ...detailRowStyle.value }}>
                  {vesselName}
                </td>
              </tr>
              <tr style={detailRowStyle.row}>
                <td style={{ ...detailRowStyle.cell, ...detailRowStyle.label }}>
                  Port of Loading
                </td>
                <td style={{ ...detailRowStyle.cell, ...detailRowStyle.value }}>
                  {portOfLoading}
                </td>
              </tr>
              <tr style={detailRowStyle.row}>
                <td style={{ ...detailRowStyle.cell, ...detailRowStyle.label }}>
                  Port of Discharge
                </td>
                <td style={{ ...detailRowStyle.cell, ...detailRowStyle.value }}>
                  {portOfDischarge}
                </td>
              </tr>
            </tbody>
          </table>
        </Section>
        <Section style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            style={emailStyles.button}
            href="https://www.mygmt.com/dashboard"
          >
            View My Shipments
          </Button>
        </Section>
        <Text
          style={{ ...emailStyles.paragraph, color: "#666", fontSize: "13px" }}
        >
          If you have any questions, please contact our support team.
        </Text>
      </Container>
    </Body>
  </Html>
);

HoldRemovedEmail.PreviewProps = {
  firstName: "John",
  bookingNumber: "BKG123456789",
  portOfLoading: "Long Beach, CA",
  portOfDischarge: "Shanghai, China",
  vesselName: "THE BIG BOAT",
  holdRemovedAt: "June 20, 2024 at 4:30 PM PST",
} as HoldRemovedEmailProps;

export default HoldRemovedEmail;
