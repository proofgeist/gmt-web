import { PrivateAppShell } from "@/components/AppShell/AppShell";
import React from "react";
import Protect from "@/components/auth/protect";
import AdminProtect from "@/components/auth/admin-protect";
import BookingDetails from "@/components/modals/booking-details";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Protect>
      <AdminProtect>
        <PrivateAppShell>{children}</PrivateAppShell>
        <BookingDetails />
      </AdminProtect>
    </Protect>
  );
}

