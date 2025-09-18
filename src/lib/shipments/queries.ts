import { BookingsLayout } from "@/config/schemas/filemaker/server";
import dayjs from "dayjs";
import type { UserSession } from "@/server/auth/utils/session";

interface QueryContext {
  user: Pick<UserSession, "reportReferenceCustomer"> | null;
}

/**
 * Base function to fetch shipments with common query patterns
 */
async function queryShipments(ctx: QueryContext, queryConditions: Record<string, string>[]) {
  const data = await BookingsLayout.findAll({
    query: [
      {
        reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
        ...Object.assign({}, ...queryConditions),
      },
      {
        "bookings_COMPANIES.shipper::reportReferenceCustomer":
          ctx.user?.reportReferenceCustomer,
        ...Object.assign({}, ...queryConditions),
      },
    ],
    limit: 1000,
  });

  return data.map((record) => record.fieldData);
}

/**
 * Get active shipments (in transit)
 */
export async function getActiveShipments(ctx: QueryContext) {
  const today = dayjs().format("MM/DD/YYYY");
  return queryShipments(ctx, [
    {
      ETADatePort: `>=${today}`,
      ETDDatePort: `<=${today}`,
    }
  ]);
}

/**
 * Get pending shipments (scheduled to sail)
 */
export async function getPendingShipments(ctx: QueryContext) {
  const today = dayjs().format("MM/DD/YYYY");
  return queryShipments(ctx, [
    {
      ETDDatePort: `>${today}`,
    }
  ]);
}

/**
 * Get past shipments (completed)
 */
export async function getPastShipments(ctx: QueryContext) {
  const today = dayjs().format("MM/DD/YYYY");
  const yearAgo = dayjs().subtract(1, "year").format("MM/DD/YYYY");
  return queryShipments(ctx, [
    {
      ETADatePort: `<${today}`,
      ETDDatePort: `>${yearAgo}`,
    }
  ]);
}

/**
 * Get shipments on hold
 */
export async function getHoldsShipments(ctx: QueryContext) {
  return queryShipments(ctx, [
    {
      holdStatusList: "*",
    }
  ]);
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
export async function getShipmentsByType(ctx: QueryContext, type: "active" | "pending" | "completed" | "holds") {
  switch (type) {
    case "active":
      return getActiveShipments(ctx);
    case "pending":
      return getPendingShipments(ctx);
    case "completed":
      return getPastShipments(ctx);
    case "holds":
      return getHoldsShipments(ctx);
  }
}
