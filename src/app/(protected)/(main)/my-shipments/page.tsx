import { BookingsLayout } from "@/config/schemas/filemaker/client";
import { Stack, Title } from "@mantine/core";
import React from "react";

import TableContent from "./table";
import { getCurrentSession } from "@/server/auth/utils/session";

export default async function TablePage() {
  const { user } = await getCurrentSession();
  // this function is limited to 100 records by default. To load more, see the other table templates from the docs
  const data = await BookingsLayout.findAll({
    query: {
      reportReferenceCustomer: user?.reportReferenceCustomer,
    },
    fetch: { next: { revalidate: 120 } }, // only call the database at most once every 60 seconds
  });
  console.log(data);
  return (
    <Stack>
      <Title order={2}>My Shipments</Title>
      <TableContent data={data.map((d) => d.fieldData)} />
    </Stack>
  );
}
