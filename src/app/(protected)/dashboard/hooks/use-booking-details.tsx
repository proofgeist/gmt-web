"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyShipmentsByGMTNumberAction } from "@/app/(protected)/actions";

export function useBookingDetails(bookingNumber: string | null) {
  return useQuery({
    queryKey: ["booking-detail", bookingNumber],
    queryFn: async () => {
      if (!bookingNumber) return null;
      const result = await getMyShipmentsByGMTNumberAction({
        gmtNumber: bookingNumber,
      });
      if (!result?.data?.data?.fieldData) return null;
      return {
        ...result.data.data.fieldData,
        cargo: result.data.data.portalData?.bookings_CARGO ?? [],
      };
    },
    enabled: !!bookingNumber,
  });
}

