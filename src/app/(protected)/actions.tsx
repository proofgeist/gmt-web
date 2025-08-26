"use server";

import { authedActionClient } from "@/server/safe-action";
import {
  BookingsLayout,
  BookingDetailsLayout,
} from "@/config/schemas/filemaker/server";
import dayjs from "dayjs";
import {
  getMyShipmentsSchema,
  getMyShipmentsByGMTNumberSchema,
  getShipmentByTypeSchema,
} from "./my-shipments/schema";
export const getShipmentByTypeAction = authedActionClient
  .schema(getShipmentByTypeSchema)
  .action(async ({ ctx, parsedInput }) => {
    try {
      const { type } = parsedInput;

      switch (type) {
        case "active":
          return getActiveShipmentsAction({ ctx }).then((data) => data?.data);
        case "pending":
          return getPendingShipmentsAction({ ctx }).then((data) => data?.data);
        case "completed":
          return getPastShipmentsAction({ ctx }).then((data) => data?.data);
        default:
          throw new Error(`Unhandled shipment type`);
      }
    } catch (error) {
      throw error instanceof Error ? error : (
          new Error("Failed to fetch shipments")
        );
    }
  });

export const getActiveShipmentsAction = authedActionClient
  .schema(getMyShipmentsSchema)
  .action(async ({ ctx }) => {
    const data = await BookingsLayout.findAll({
      query: [
        {
          reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
          ETADatePort: `>=${dayjs().format("MM/DD/YYYY")}`,
          ETDDatePort: `<=${dayjs().format("MM/DD/YYYY")}`,
        },
        {
          _kfnShipperCompanyID: ctx.user?.company_id,
          ETADatePort: `>=${dayjs().format("MM/DD/YYYY")}`,
          ETDDatePort: `<=${dayjs().format("MM/DD/YYYY")}`,
        },
      ],
      limit: 1000,
    });

    return data.map((record) => record.fieldData);
  });
export const getPendingShipmentsAction = authedActionClient
  .schema(getMyShipmentsSchema)
  .action(async ({ ctx }) => {
    const data = await BookingsLayout.findAll({
      query: [
        {
          reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
          ETDDatePort: `>${dayjs().format("MM/DD/YYYY")}`,
        },
        {
          _kfnShipperCompanyID: ctx.user?.company_id,
          ETDDatePort: `>${dayjs().format("MM/DD/YYYY")}`,
        },
      ],
      limit: 1000,
    });

    return data.map((record) => record.fieldData);
  });
export const getPastShipmentsAction = authedActionClient
  .schema(getMyShipmentsSchema)
  .action(async ({ ctx }) => {
    const data = await BookingsLayout.findAll({
      query: [
        {
          reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
          ETADatePort: `<${dayjs().format("MM/DD/YYYY")}`,
          ETDDatePort: `>${dayjs().subtract(1, "year").format("MM/DD/YYYY")}`,
        },
        {
          _kfnShipperCompanyID: ctx.user?.company_id,
          ETADatePort: `<${dayjs().format("MM/DD/YYYY")}`,
          ETDDatePort: `>${dayjs().subtract(1, "year").format("MM/DD/YYYY")}`,
        },
      ],
      limit: 1000,
    });

    return data.map((record) => record.fieldData);
  });

export const getMyShipmentsByGMTNumberAction = authedActionClient
  .schema(getMyShipmentsByGMTNumberSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { gmtNumber } = parsedInput;

    const data = await BookingDetailsLayout.findOne({
      query: {
        reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
        "_GMT#": gmtNumber,
      },
    });

    return data;
  });
