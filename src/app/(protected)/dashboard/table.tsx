"use client";

import type { TBookings } from "@/config/schemas/filemaker/Bookings";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import React from "react";

import { useRouter } from "next/navigation";
import { columns } from "../my-shipments/table";
type TData = TBookings;



export default function MyTable({ data }: { data: TData[] }) {
  const router = useRouter();
  console.log(data);
  const table = useMantineReactTable({
    data,
    columns,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    initialState: {
      sorting: [{ id: "ETADatePort", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      style: { cursor: "pointer" },
      onClick: () => {
        const gmtNumber = row.original["_GMT#"];
        router.push(`/my-shipments?bookingNumber=${gmtNumber}`);
      },
    }),
  });
  return <MantineReactTable table={table} />;
}
