import { Heading, Text, Link } from "@react-email/components";
import * as React from "react";
import { emailStyles } from "./styles";
import type { TBookings } from "@/config/schemas/filemaker/Bookings";
import dayjs from "dayjs";
import { EmailLayout } from "./components/EmailLayout";
import { EMAIL_BASE_URL } from "./config";

interface DailyReportEmailProps {
  userName?: string;
  bookings: TBookings[];
  unsubscribeToken: string;
}

// Styles for the bookings table
const tableStyles = {
  table: {
    width: "100%",
    borderCollapse: "separate" as const,
    borderSpacing: "0",
    margin: "20px 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
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
  tfoot: {
    backgroundColor: "#f8f9fa",
    borderTop: "2px solid #ddd",
  },
  tfootTd: {
    padding: "14px 12px",
    fontSize: "14px",
    color: "#333",
    fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
    textAlign: "center" as const,
    borderBottom: "none",
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
  const MAX_BOOKINGS_TO_SHOW = 10;

  // Sort bookings by soonest arrival date (ETA), with bookings without dates at the end
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = a.ETADatePort ? dayjs(a.ETADatePort, "MM/DD/YYYY") : null;
    const dateB = b.ETADatePort ? dayjs(b.ETADatePort, "MM/DD/YYYY") : null;

    // If both have valid dates, sort by earliest first
    if (dateA?.isValid() && dateB?.isValid()) {
      return dateA.valueOf() - dateB.valueOf();
    }
    // If only A has a valid date, it comes first
    if (dateA?.isValid()) return -1;
    // If only B has a valid date, it comes first
    if (dateB?.isValid()) return 1;
    // If neither has a valid date, keep original order
    return 0;
  });

  const displayedBookings = sortedBookings.slice(0, MAX_BOOKINGS_TO_SHOW);
  const hasMoreBookings = sortedBookings.length > MAX_BOOKINGS_TO_SHOW;

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
        {sortedBookings.length} active booking
        {sortedBookings.length !== 1 ? "s" : ""}.
      </Text>

      {sortedBookings.length > 0 ?
        <>
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
              {displayedBookings.map((booking, index) => {
                const isLastRow = index === displayedBookings.length - 1;
                const tdStyle =
                  isLastRow && hasMoreBookings ?
                    { ...tableStyles.td, borderBottom: "none" }
                  : tableStyles.td;

                return (
                  <tr key={booking["_GMT#"]}>
                    <td style={tdStyle}>
                      <Link
                        href={`${EMAIL_BASE_URL}/dashboard?bookingNumber=${encodeURIComponent(booking["_GMT#"])}`}
                        style={tableStyles.link}
                      >
                        {booking["_GMT#"]}
                      </Link>
                    </td>
                    <td style={tdStyle}>{booking["_Booking#"] || "-"}</td>
                    <td style={tdStyle}>{getStatusBadge(booking)}</td>
                    <td style={tdStyle}>{formatDate(booking.ETDDatePort)}</td>
                    <td style={tdStyle}>{formatDate(booking.ETADatePort)}</td>
                    <td style={tdStyle}>
                      {(
                        booking.portOfLoadingCity && booking.portOfDischargeCity
                      ) ?
                        `${booking.portOfLoadingCity} → ${booking.portOfDischargeCity}`
                      : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {hasMoreBookings && (
              <tfoot style={tableStyles.tfoot}>
                <tr>
                  <td colSpan={6} style={tableStyles.tfootTd}>
                    <Link
                      href={`${EMAIL_BASE_URL}/dashboard`}
                      style={tableStyles.link}
                    >
                      View all {sortedBookings.length} bookings →
                    </Link>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </>
      : <Text style={emailStyles.paragraph}>
          You currently have no active bookings.
        </Text>
      }

      <Text style={emailStyles.paragraph}>
        Click on any GMT Number above to view detailed shipment information on{" "}
        <Link href={EMAIL_BASE_URL} style={tableStyles.link}>
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
      portOfDischargeCountry: "China",
      portOfLoadingCountry: "USA",
      placeOfDeliveryCity: "Beijing",
      placeOfReceiptCity: "Los Angeles",
      ETDDatePort: "01/15/2024",
      ETADatePort: "02/10/2024",
      holdStatusList: [],
      reportReferenceCustomer: "CUST-001",
      SSLineCompany: "Maersk",
      "_shipperReference#": "SHP-001",
      _kfnShipperCompanyID: "123",
      maerskDepartureEventTS: "",
      maerskArrivalEventTS: "",
      maerskRefreshTS: "",
      "bookings_COMPANIES.agent::reportReferenceCustomer": "",
      "bookings_COMPANIES.shipper::reportReferenceCustomer": "",
      "bookings_CARGO::containerNumber": "",
    },
  ],
  unsubscribeToken: "test-token",
} as DailyReportEmailProps;

export default DailyReportEmail;
