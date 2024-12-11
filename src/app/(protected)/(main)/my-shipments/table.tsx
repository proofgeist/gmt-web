"use client";

import { TBookingsReport } from "@/config/schemas/filemaker/BookingsReport";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import React from "react";

type TData = TBookingsReport;

const columns: MRT_ColumnDef<TData>[] = [
  {
    accessorKey: "<No Access>",
    header: "<No Access>",
  },
];

export default function MyTable({ data }: { data: TData[] }) {
  const table = useMantineReactTable({ data, columns });
  return <MantineReactTable table={table} />;
}
