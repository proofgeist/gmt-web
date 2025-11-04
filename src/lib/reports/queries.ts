import { getActiveShipments } from "@/lib/shipments/queries";
import type { UserSession } from "@/server/auth/utils/session";
import type { TBookings } from "@/config/schemas/filemaker/Bookings";

/**
 * Get active bookings for a user session
 * Uses the same logic as getActiveShipments to ensure consistency
 * @param user - The user session with webAccessType and reportReferenceCustomer
 * @returns Array of active bookings
 */
export async function getUserActiveBookings(
  user: UserSession
): Promise<TBookings[]> {
  return getActiveShipments({ user });
}

