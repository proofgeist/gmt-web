"use client";

import type { TBookings } from "@/config/schemas/filemaker/Bookings";
import { Text } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import React from "react";
import { useRouter } from "next/navigation";
import { columns } from "@/components/tables/bookings-columns";



export default function BookingsTable({
  data,
  selectedBooking,
}: {
  data: TBookings[] | undefined;
  selectedBooking?: string;
}) {
  const router = useRouter();

  const table = useMantineReactTable({
    data: data ?? [],
    columns,
    initialState: {
      sorting: [{ id: "ETADatePort", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    renderEmptyRowsFallback: () => (
      <Text py={"2rem"} style={{ fontStyle: "italic" }} c="dimmed" ta="center">
        No shipments found
      </Text>
    ),

    mantineTableBodyRowProps: ({ row }) => ({
      selected: row.original["_Booking#"] === selectedBooking,
      style: { cursor: "pointer" },
      onClick: () => {
        const gmtNumber = row.original["_GMT#"];
        router.replace(`/my-shipments?bookingNumber=${gmtNumber}`);
      },
    }),
  });

  return (
    <>
      <MantineReactTable table={table} />
    </>
  );
}
