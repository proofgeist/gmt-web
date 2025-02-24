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
} from "./schema";

export const getMyShipmentsAction = authedActionClient
  .schema(getMyShipmentsSchema)
  .action(async ({ ctx }) => {
    const data = await BookingsLayout.findAll({
      query: {
        reportReferenceCustomer: ctx.user?.reportReferenceCustomer,
        ETADatePort: `>=${dayjs().subtract(7, "day").format("MM/DD/YYYY")}`,
      },
      limit: 1000,
      fetch: { next: { revalidate: 120 } },
    });

    return data;
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
