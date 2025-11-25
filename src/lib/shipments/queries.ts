import { BookingsLayout } from "@/config/schemas/filemaker/client";
import { BookingsDetailsLayout } from "@/config/schemas/filemaker/client";
import dayjs from "dayjs";
import type { UserSession } from "@/server/auth/utils/session";
import type { ShipmentType } from "@/app/(protected)/dashboard/schema";

interface QueryContext {
  user: Pick<UserSession, "reportReferenceCustomer" | "webAccessType"> | null;
}

/**
 * Helper function to get the correct field name based on user access type
 */
function getReferenceCustomerField(
  webAccessType: UserSession["webAccessType"] | null | undefined
) {
  if (!webAccessType) {
    throw new Error("Web access type is required to query shipments");
  }

  switch (webAccessType) {
    case "shipper":
      return "bookings_COMPANIES.shipper::reportReferenceCustomer";
    case "agent":
      return "bookings_COMPANIES.agent::reportReferenceCustomer";
    case "customer":
      return "reportReferenceCustomer";
  }
}

/**
 * Get active shipments (in transit)
 */
export async function getActiveShipments(ctx: QueryContext) {
  const today = dayjs().format("MM/DD/YYYY");
  const field = getReferenceCustomerField(ctx.user?.webAccessType);

  const data = await BookingsLayout.findAll({
    query: [
      {
        [field]: ctx.user?.reportReferenceCustomer,
        ETADatePort: `>=${today}`,
      },
      {
        [field]: ctx.user?.reportReferenceCustomer,
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
  const field = getReferenceCustomerField(ctx.user?.webAccessType);

  const data = await BookingsLayout.findAll({
    query: [
      {
        [field]: ctx.user?.reportReferenceCustomer,
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
  const field = getReferenceCustomerField(ctx.user?.webAccessType);

  const data = await BookingsLayout.findAll({
    query: {
      [field]: ctx.user?.reportReferenceCustomer,
      holdStatusList: "*",
    },
    limit: 1000,
  });

  return data.map((record) => record.fieldData);
}

/**
 * Get a single shipment by GMT number
 */
export async function getShipmentByGMTNumber(
  ctx: QueryContext,
  gmtNumber: string
) {
  const field = getReferenceCustomerField(ctx.user?.webAccessType);

  const data = await BookingsDetailsLayout.findOne({
    query: {
      [field]: ctx.user?.reportReferenceCustomer,
      "_GMT#": gmtNumber,
    },
  });

  return {
    ...data.data.fieldData,
    cargo: data.data.portalData?.bookings_CARGO ?? [],
  };
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
