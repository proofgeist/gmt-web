"use client";

import type { TBookings } from "@/config/schemas/filemaker/Bookings";
import { Badge, Group, Text } from "@mantine/core";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import React from "react";
import dayjs from "dayjs";
import { toProperCase } from "@/utils/functions";
import { useRouter } from "next/navigation";
import BookingDetails from "./components/booking-details";

type TData = TBookings;

export const columns: MRT_ColumnDef<TData>[] = [
  {
    accessorKey: "_GMT#",
    header: "GMT #",
  },
  {
    accessorKey: "SSLineCompany",
    header: "Steamship Line",
  },
  {
    accessorKey: "placeOfReceiptCity",
    header: "Place of Receipt",
    Cell: ({ row }) => {
      const {
        placeOfReceiptCity,
        placeOfReceiptCountry,
        placeOfReceiptState,
        placeOfReceiptZipCode,
      } = row.original;
      return (
        <Text>
          {[
            toProperCase(placeOfReceiptCity),
            [placeOfReceiptState, placeOfReceiptZipCode]
              .filter(Boolean)
              .join(" "),
            toProperCase(placeOfReceiptCountry),
          ]
            .filter(Boolean)
            .join(", ")}
        </Text>
      );
    },
  },
  {
    accessorKey: "ETDDatePort",
    header: "Sailing Date",
    filterFn: (row, _, filterValue: string) => {
      return dayjs(row.original.ETDDatePort).isSame(dayjs(filterValue));
    },
    sortingFn: (a, b) => {
      return (
        dayjs(a.original.ETDDatePort).unix() -
        dayjs(b.original.ETDDatePort).unix()
      );
    },
    Cell: ({ cell }) => {
      const value = cell.getValue<string | null>();
      if (!value) return null;
      return <Text>{dayjs(value).format("M/DD/YYYY")}</Text>;
    },
    filterVariant: "date",
  },
  {
    accessorKey: "ETADatePort",
    header: "Arrival Date",
    filterFn: (row, _, filterValue: string) => {
      return dayjs(row.original.ETADatePort).isSame(dayjs(filterValue));
    },
    sortingFn: (a, b) => {
      return (
        dayjs(a.original.ETADatePort).unix() -
        dayjs(b.original.ETADatePort).unix()
      );
    },
    Cell: ({ cell }) => {
      const value = cell.getValue<string | null>();
      if (!value) return <Text>-</Text>;
      return <Text>{dayjs(value).format("M/DD/YYYY")}</Text>;
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
  {
    id: "holds",
    header: "Holds",
    Cell: ({ row }) => {
      const { holdStatus } = row.original;
      if (!holdStatus || typeof holdStatus !== "string") return null;
      return (
        <Group>
          {holdStatus.split(", ").map((status: string) => (
            <Badge key={status}>{status}</Badge>
          ))}
        </Group>
      );
    },
  },
];

export default function MyTable({
  data,
  selectedBooking,
}: {
  data: TData[] | undefined;
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
