"use server";

import { BookingsLayout } from "@/config/schemas/filemaker/client";
import { getCurrentSession } from "@/server/auth/utils/session";
import dayjs from "dayjs";

export async function getMyShipments() {
  const { user } = await getCurrentSession();
 

  const data = await BookingsLayout.findAll({
    query: {
      reportReferenceCustomer: user?.reportReferenceCustomer,
      ETADatePort: `>=${dayjs().subtract(7, "day").format("MM/DD/YYYY")}`,
    },
    limit: 1000,
    fetch: { next: { revalidate: 120 } },
  });

  return data;
}
