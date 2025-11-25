"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyShipmentsByGMTNumberAction } from "@/app/(protected)/actions";

/**
 * Query configuration for booking details
 * Centralized to ensure consistency between prefetch and query
 */
const bookingDetailsQueryOptions = (gmtNumber: string) => ({
  queryKey: ["booking-detail", gmtNumber],
  queryFn: async () => {
    const result = await getMyShipmentsByGMTNumberAction({
      gmtNumber,
    });
    return result?.data;
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
});

/**
 * Hook to fetch booking details by GMT number
 */
export function useBookingDetails(bookingNumber: string | null) {
  return useQuery({
    ...bookingDetailsQueryOptions(bookingNumber || ""),
    enabled: !!bookingNumber,
  });
}

/**
 * Hook to prefetch booking details (e.g., on hover)
 * Returns a function that prefetches booking details for a given GMT number
 */
export function usePrefetchBookingDetails() {
  const queryClient = useQueryClient();

  return (gmtNumber: string) => {
    queryClient.prefetchQuery(bookingDetailsQueryOptions(gmtNumber));
  };
}

