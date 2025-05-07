"use server";

import { authedActionClient } from "@/server/safe-action";
import {
  BookingsLayout,
  BookingDetailsLayout,
} from "@/config/schemas/filemaker/client";
import dayjs from "dayjs";
import {
  getMyShipmentsSchema,
  getMyShipmentsByGMTNumberSchema,
  getShipmentByTypeSchema,
} from "./my-shipments/schema";
export const getShipmentByTypeAction = authedActionClient
  .schema(getShipmentByTypeSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { type } = parsedInput;

    if (type === "active") {
      return getActiveShipmentsAction({ ctx }).then((data) => data?.data);
    } else if (type === "pending") {
      return getPendingShipmentsAction({ ctx }).then((data) => data?.data);
    } else if (type === "completed") {
      return getPastShipmentsAction({ ctx }).then((data) => data?.data);
    }
  });

export const getActiveShipmentsAction = authedActionClient
  .schema(getMyShipmentsSchema)
  .action(async ({ ctx }) => {
    const data = await BookingsLayout.findAll({
      query: {
        reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
        ETADatePort: `>=${dayjs().format("MM/DD/YYYY")}`,
        ETDDatePort: `<=${dayjs().format("MM/DD/YYYY")}`,
      },
      limit: 1000,
      fetch: { next: { revalidate: 120 } },
    });

    return data.map((record) => record.fieldData);
  });
export const getPendingShipmentsAction = authedActionClient
  .schema(getMyShipmentsSchema)
  .action(async ({ ctx }) => {
    const data = await BookingsLayout.findAll({
      query: {
        reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
        ETDDatePort: `>${dayjs().format("MM/DD/YYYY")}`,
      },
      limit: 1000,
      fetch: { next: { revalidate: 120 } },
    });

    return data.map((record) => record.fieldData);
  });
export const getPastShipmentsAction = authedActionClient
  .schema(getMyShipmentsSchema)
  .action(async ({ ctx }) => {
    const data = await BookingsLayout.findAll({
      query: {
        reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
        ETADatePort: `<${dayjs().format("MM/DD/YYYY")}`,
        ETDDatePort: `>${dayjs().subtract(1, "year").format("MM/DD/YYYY")}`,
      },
      limit: 1000,
      fetch: { next: { revalidate: 120 } },
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
