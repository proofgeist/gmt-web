"use client";

import type { TBookings } from "@/config/schemas/filemaker/Bookings";
import { Text } from "@mantine/core";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import React from "react";
import dayjs from "dayjs";
import { toProperCase } from "@/utils/functions";
type TData = TBookings;

const columns: MRT_ColumnDef<TData>[] = [
  {
    accessorKey: "_Booking#",
    header: "Booking #",
  },
  {
    accessorKey: "ETDDatePort",
    header: "ETD Port",
    filterFn: (row, _, filterValue) => {
      return dayjs(row.original.ETDDatePort).isSame(dayjs(filterValue));
    },
    sortingFn: (a, b) => {
      return (
        dayjs(a.original.ETDDatePort).unix() -
        dayjs(b.original.ETDDatePort).unix()
      );
    },
    Cell: ({ cell }) => {
      return (
        <Text>{dayjs(cell.getValue() as string).format("M/DD/YYYY")}</Text>
      );
    },
    filterVariant: "date",
  },
  {
    accessorKey: "ETADatePort",
    header: "ETA Port",
    filterFn: (row, _, filterValue) => {
      return dayjs(row.original.ETADatePort).isSame(dayjs(filterValue));
    },
    sortingFn: (a, b) => {
      return (
        dayjs(a.original.ETADatePort).unix() -
        dayjs(b.original.ETADatePort).unix()
      );
    },
    Cell: ({ cell }) => {
      return (
        <Text>{dayjs(cell.getValue() as string).format("M/DD/YYYY")}</Text>
      );
    },
    filterVariant: "date",
  },
  {
    id: "portOfDischarge",
    header: "Port of Discharge",
    Cell: ({ row }) => {
      const { portOfDischargeCity, portOfDischargeCountry } = row.original;
      return (
        <Text>
          {toProperCase(
            [portOfDischargeCity, portOfDischargeCountry]
              .filter(Boolean)
              .join(", ")
          )}
        </Text>
      );
    },
  },
  {
    id: "deliveryPlace",
    header: "Place of Delivery",
    Cell: ({ row }) => {
      const { placeOfDeliveryCity, placeOfDeliveryCountry } = row.original;
      return (
        <Text>
          {toProperCase(
            [placeOfDeliveryCity, placeOfDeliveryCountry]
              .filter(Boolean)
              .join(", ")
          )}
        </Text>
      );
    },
  },
];

export default function MyTable({ data }: { data: TData[] }) {
  const table = useMantineReactTable({
    data,
    columns,
    initialState: {
      sorting: [{ id: "ETADatePort", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });
  return <MantineReactTable table={table} />;
}
