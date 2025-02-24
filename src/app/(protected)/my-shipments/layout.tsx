"use client";
import { useSearchParams } from "next/navigation";
import BookingDetails from "./components/booking-details";
import { useEffect, useState } from "react";

export default function MyShipmentsLayout({
  children,

}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const bookingNumberFromParams = searchParams.get("bookingNumber");
  const [bookingNumber, setBookingNumber] = useState<string | null>(null);

  useEffect(() => {
    setBookingNumber(bookingNumberFromParams ?? null);
  }, [bookingNumberFromParams]);

  return (
    <>
      {children}
      <BookingDetails selectedBooking={bookingNumber} />
    </>
  );
}
