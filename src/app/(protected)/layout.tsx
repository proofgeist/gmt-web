import { PrivateAppShell } from "@/components/AppShell/AppShell";
import React from "react";
import Protect from "@/components/auth/protect";
import BookingDetails from "@/components/modals/booking-details";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Protect>
      <PrivateAppShell>{children}</PrivateAppShell>
      <BookingDetails />
    </Protect>
  );
}
