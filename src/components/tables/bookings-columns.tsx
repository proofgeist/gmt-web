"use client";
import { MRT_ColumnDef, MRT_Cell } from "mantine-react-table";
import type { TBookings } from "@/config/schemas/filemaker/Bookings";
import { Badge, Group, Text } from "@mantine/core";
import { toProperCase } from "@/utils/functions";
import dayjs from "dayjs";
import { IconX } from "@tabler/icons-react";
import { useReleaseShipperHold } from "@/app/(protected)/my-shipments/hooks/use-release-shipper-hold";

function HoldsCell({ cell }: { cell: MRT_Cell<TBookings> }) {
  const { releaseHold } = useReleaseShipperHold();
  const value = cell.getValue<TBookings["holdStatusArray"]>();
  if (!value) return null;

  return (
    <Group>
      {value.length > 0 ?
        value.map((status: string) =>
          status === "Shipper Hold" ?
            <Badge
              key={status}
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                const row = cell.row.original;
                releaseHold({
                  gmt_no: row["_GMT#"],
                  portOfLoading: [
                    row.portOfLoadingCity,
                    row.portOfLoadingCountry,
                  ]
                    .filter(Boolean)
                    .join(", "),
                  portOfDischarge: [
                    row.portOfDischargeCity,
                    row.portOfDischargeCountry,
                  ]
                    .filter(Boolean)
                    .join(", "),
                  vesselName: row.SSLineCompany,
                });
              }}
              rightSection={<IconX size={12} />}
              style={{ cursor: "pointer" }}
            >
              {status}
            </Badge>
          : <Badge key={status}>{status}</Badge>
        )
      : <Text c="dimmed">No holds</Text>}
    </Group>
  );
}

export const columns: MRT_ColumnDef<TBookings>[] = [
  {
    accessorKey: "_GMT#",
    header: "GMT #",
    size: 125,
    maxSize: 125,
  },
  {
    accessorKey: "_shipperReference#",
    header: "Shipper Reference",
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
    header: "Port of Discharge",
    accessorFn: (row) =>
      [row.portOfDischargeCity, row.portOfDischargeCountry]
        .filter(Boolean)
        .join(", "),
    id: "portOfDischarge",
    Cell: ({ cell }) => <Text>{toProperCase(cell.getValue<string>())}</Text>,
    filterVariant: "text",
  },
  {
    header: "Place of Delivery",
    accessorFn: (row) =>
      [row.placeOfDeliveryCity, row.placeOfDeliveryCountry]
        .filter(Boolean)
        .join(", "),
    id: "deliveryPlace",
    Cell: ({ cell }) => <Text>{toProperCase(cell.getValue<string>())}</Text>,
    filterVariant: "text",
  },
  {
    id: "holds",
    header: "Holds",
    accessorFn: (row) => row.holdStatusArray,
    Cell: ({ cell }) => <HoldsCell cell={cell} />,
    filterVariant: "text",
  },
];
