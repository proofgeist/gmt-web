import { PrivateAppShell } from "@/components/AppShell/AppShell";
import React from "react";
import Protect from "@/components/auth/protect";
import BookingDetails from "@/components/modals/booking-details";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getCurrentSession } from "@/server/auth/utils/session";
import getQueryClient from "@/config/get-query-client";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  // Prefetch current user session
  await queryClient.prefetchQuery({
    queryKey: ["current-user"],
    queryFn: () => getCurrentSession(),
  });

  return (
    <Protect>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PrivateAppShell>{children}</PrivateAppShell>
        <BookingDetails />
      </HydrationBoundary>
    </Protect>
  );
}
