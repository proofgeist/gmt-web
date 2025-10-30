import { Heading, Text, Link } from "@react-email/components";
import * as React from "react";
import { env } from "@/config/env";
import { emailStyles } from "./styles";
import type { TBookings } from "@/config/schemas/filemaker/Bookings";
import dayjs from "dayjs";
import { EmailLayout } from "./components/EmailLayout";

const BASE_URL =
  env.NODE_ENV === "production" ?
    "https://www.mygmt.com"
  : "http://localhost:3000";

interface DailyReportEmailProps {
  userName?: string;
  bookings: TBookings[];
  unsubscribeToken: string;
}

// Styles for the bookings table
const tableStyles = {
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    margin: "20px 0",
    border: "1px solid #ddd",
  },
  thead: {
    backgroundColor: "#f5f5f5",
  },
  th: {
    padding: "12px",
    textAlign: "left" as const,
    fontWeight: "600",
    fontSize: "13px",
    color: "#333",
    fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "10px 12px",
    fontSize: "14px",
    color: "#444",
    fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
    borderBottom: "1px solid #eee",
  },
  link: {
    color: "#171796",
    textDecoration: "none",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "#ff9800",
    color: "#fff",
  },
};

export const DailyReportEmail = ({
  userName,
  bookings,
  unsubscribeToken,
}: DailyReportEmailProps) => {
  const today = dayjs().format("MMMM D, YYYY");

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      // FileMaker dates are MM/DD/YYYY format
      const date = dayjs(dateStr, "MM/DD/YYYY");
      return date.isValid() ? date.format("MMM D, YYYY") : dateStr;
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (booking: TBookings) => {
    if (booking.holdStatusList && booking.holdStatusList.length > 0) {
      return <span style={tableStyles.statusBadge}>On Hold</span>;
    }
    return null;
  };

  return (
    <EmailLayout unsubscribeToken={unsubscribeToken} fullHeight={true}>
      <Heading style={emailStyles.secondary}>
        {userName ? `Hello ${userName},` : "Hello,"}
      </Heading>

      <Text style={emailStyles.paragraph}>
        Here is your daily booking report for {today}. You have{" "}
        {bookings.length} active booking{bookings.length !== 1 ? "s" : ""}.
      </Text>

      {bookings.length > 0 ?
        <table style={tableStyles.table}>
          <thead style={tableStyles.thead}>
            <tr>
              <th style={tableStyles.th}>GMT Number</th>
              <th style={tableStyles.th}>Booking Number</th>
              <th style={tableStyles.th}>Status</th>
              <th style={tableStyles.th}>ETD</th>
              <th style={tableStyles.th}>ETA</th>
              <th style={tableStyles.th}>Route</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking["_GMT#"]}>
                <td style={tableStyles.td}>
                  <Link
                    href={`${BASE_URL}/dashboard?bookingNumber=${encodeURIComponent(booking["_GMT#"])}`}
                    style={tableStyles.link}
                  >
                    {booking["_GMT#"]}
                  </Link>
                </td>
                <td style={tableStyles.td}>{booking["_Booking#"] || "-"}</td>
                <td style={tableStyles.td}>{getStatusBadge(booking)}</td>
                <td style={tableStyles.td}>
                  {formatDate(booking.ETDDatePort)}
                </td>
                <td style={tableStyles.td}>
                  {formatDate(booking.ETADatePort)}
                </td>
                <td style={tableStyles.td}>
                  {booking.portOfLoadingCity && booking.portOfDischargeCity ?
                    `${booking.portOfLoadingCity} → ${booking.portOfDischargeCity}`
                  : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      : <Text style={emailStyles.paragraph}>
          You currently have no active bookings.
        </Text>
      }

      <Text style={emailStyles.paragraph}>
        Click on any GMT Number above to view detailed shipment information on{" "}
        <Link href={BASE_URL} style={tableStyles.link}>
          MyGMT.com
        </Link>
        .
      </Text>
    </EmailLayout>
  );
};

DailyReportEmail.PreviewProps = {
  userName: "John",
  bookings: [
    {
      "_GMT#": "GMT-2024-001",
      "_Booking#": "BK-001",
      portOfLoadingCity: "Los Angeles",
      portOfDischargeCity: "Shanghai",
      ETDDatePort: "01/15/2024",
      ETADatePort: "02/10/2024",
      holdStatusList: [],
      reportReferenceCustomer: "CUST-001",
      portOfDischargeCountry: "",
      placeOfDeliveryCity: "",
      placeOfDeliveryCountry: "",
      ETADateCity: "",
      SSLineCompany: "",
      "_shipperReference#": "",
      zctListContainersWithSizes: "",
      placeOfReceiptCity: "",
      placeOfReceiptState: "",
      placeOfReceiptZipCode: "",
      placeOfReceiptCountry: "",
      portOfLoadingCountry: "",
      _kfnShipperCompanyID: "",
      SSLineVessel: "",
      SSLineVoyage: "",
      onHoldByShipperTStamp: "",
      onHoldGmtTStamp: "",
      agentOnHoldTStamp: "",
      customsHoldTStamp: "",
      directShipmentOnHoldTStamp: "",
      SSLineInstructionsRemarks: "",
      onHoldByShipperRequestedTStamp: "",
      maerskDepartureEventTS: "",
      maerskArrivalEventTS: "",
      maerskRefreshTS: "",
      "bookings_COMPANIES.agent::reportReferenceCustomer": "",
      "bookings_COMPANIES.shipper::reportReferenceCustomer": "",
    },
  ],
  unsubscribeToken: "test-token",
} as DailyReportEmailProps;

export default DailyReportEmail;
