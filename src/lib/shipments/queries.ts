import { BookingsLayout } from "@/config/schemas/filemaker/server";
import dayjs from "dayjs";
import type { UserSession } from "@/server/auth/utils/session";
import type { ShipmentType } from "@/app/(protected)/my-shipments/schema";

interface QueryContext {
  user: Pick<UserSession, "reportReferenceCustomer"> | null;
}

/**
 * Get active shipments (in transit)
 */
export async function getActiveShipments(ctx: QueryContext) {
  const today = dayjs().format("MM/DD/YYYY");
  const data = await BookingsLayout.findAll({
    query: [
      {
        reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
        ETADatePort: `>=${today}`,
      },
      {
        "bookings_COMPANIES.shipper::reportReferenceCustomer":
          ctx.user?.reportReferenceCustomer,
        ETADatePort: `>=${today}`,
      },
      {
        reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
        holdStatusList: "*",
      },
      {
        "bookings_COMPANIES.shipper::reportReferenceCustomer":
          ctx.user?.reportReferenceCustomer,
        holdStatusList: "*",
      },
    ],
    limit: 1000,
  });

  return data.map((record) => record.fieldData);
}
/**
 * Get past shipments (completed)
 */
export async function getPastShipments(ctx: QueryContext) {
  const today = dayjs().format("MM/DD/YYYY");
  const yearAgo = dayjs().subtract(1, "year").format("MM/DD/YYYY");
  const data = await BookingsLayout.findAll({
    query: [
      {
        reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
        ETADatePort: `<${today}`,
        ETDDatePort: `>${yearAgo}`,
      },
      {
        "bookings_COMPANIES.shipper::reportReferenceCustomer":
          ctx.user?.reportReferenceCustomer,
        ETADatePort: `<${today}`,
        ETDDatePort: `>${yearAgo}`,
      },
      {
        holdStatusList: "*",
        omit: "true",
      },
    ],
    limit: 1000,
  });

  return data.map((record) => record.fieldData);
}

/**
 * Get shipments on hold
 */
export async function getHoldsShipments(ctx: QueryContext) {
  const data = await BookingsLayout.findAll({
    query: [
      {
        reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
        holdStatusList: "*",
      },
      {
        "bookings_COMPANIES.shipper::reportReferenceCustomer":
          ctx.user?.reportReferenceCustomer,
        holdStatusList: "*",
      },
    ],
    limit: 1000,
  });

  return data.map((record) => record.fieldData);
}

/**
 * Get a single shipment by GMT number
 */
export async function getShipmentByGMTNumber(ctx: QueryContext, gmtNumber: string) {
  const data = await BookingsLayout.findOne({
    query: [
      {
        reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
        "_GMT#": gmtNumber,
      },
      {
        "bookings_COMPANIES.shipper::reportReferenceCustomer": ctx.user?.reportReferenceCustomer,
        "_GMT#": gmtNumber,
      },
    ],
  });

  return data;
}

/**
 * Get shipments by type (active, pending, completed, holds)
 */
export async function getShipmentsByType(
  ctx: QueryContext,
  type: ShipmentType
) {
  switch (type) {
    case "active":
      return getActiveShipments(ctx);

    case "completed":
      return getPastShipments(ctx);
  }
}
