"use client";
import { MRT_ColumnDef, MRT_Cell } from "mantine-react-table";
import {
  HoldStatusEnum,
  type TBookings,
} from "@/config/schemas/filemaker/Bookings";
import { Badge, Group, Text } from "@mantine/core";
import { toProperCase } from "@/utils/functions";
import dayjs from "dayjs";
import { IconX } from "@tabler/icons-react";
import { useReleaseShipperHold } from "@/app/(protected)/my-shipments/hooks/use-release-shipper-hold";
import { useUser } from "../auth/use-user";

function HoldsCell({ cell }: { cell: MRT_Cell<TBookings> }) {
  const { releaseHold } = useReleaseShipperHold();
  const { user } = useUser();
  const value = cell.getValue<TBookings["holdStatusList"]>();
  if (!value) return null;

  return (
    <Group>
      {value.length > 0 &&
        value.map((status) =>
          status === "Shipper Hold" && cell.row.original["bookings_COMPANIES.shipper::reportReferenceCustomer"] === user?.reportReferenceCustomer ?
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
        )}
    </Group>
  );
}
export const columns: MRT_ColumnDef<TBookings>[] = [
  {
    accessorKey: "_GMT#",
    header: "GMT #",
    enableClickToCopy: true,
  },
  {
    accessorKey: "_Booking#",
    header: "SS Line Booking",
    enableClickToCopy: true,
    filterVariant: "text",
  },
  {
    accessorKey: "_shipperReference#",
    header: "Shipper Ref",
    enableClickToCopy: true,
    Cell: ({ cell }) =>
      cell.getValue<string>() && (
        <Text>{cell.getValue<string>().toUpperCase()}</Text>
      ),
  },
  {
    accessorKey: "placeOfReceiptCity",
    header: "PO Receipt",
    Cell: ({ cell }) =>
      cell.getValue<string>() && (
        <Group gap="xs">
          <Text>{toProperCase(cell.getValue<string>())}</Text>
        </Group>
      ),
    filterVariant: "text",
  },
  {
    header: "PO Loading",
    accessorKey: "portOfLoadingCity",
    Cell: ({ cell }) =>
      cell.getValue<string>() && (
        <Group gap="xs">
          <Text>{toProperCase(cell.getValue<string>())}</Text>
        </Group>
      ),
    filterVariant: "text",
  },
  {
    header: "PO Discharge",
    accessorKey: "portOfDischargeCity",
    Cell: ({ cell }) =>
      cell.getValue<string>() && (
        <Group gap="xs">
          <Text>{toProperCase(cell.getValue<string>())}</Text>
        </Group>
      ),
    filterVariant: "text",
  },
  {
    header: "PO Delivery",
    accessorKey: "placeOfDeliveryCity",
    Cell: ({ cell }) =>
      cell.getValue<string>() && (
        <Group gap="xs">
          <Text>{toProperCase(cell.getValue<string>())}</Text>
        </Group>
      ),
    filterVariant: "text",
  },
  {
    accessorKey: "ETDDatePort",
    size: 100,
    header: "ETD",
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
      return (
        value && (
          <Group gap="xs">
            <Text>{dayjs(value).format("M/DD/YYYY")}</Text>
          </Group>
        )
      );
    },
    filterVariant: "date",
  },
  {
    accessorKey: "ETADatePort",
    header: "ETA",
    size: 100,
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
      return (
        value && (
          <Group gap="xs">
            <Text>{dayjs(value).format("M/DD/YYYY")}</Text>
          </Group>
        )
      );
    },
    filterVariant: "date",
  },
  {
    id: "holds",
    header: "Status",
    accessorFn: (row) => row.holdStatusList,
    Cell: ({ cell }) => <HoldsCell cell={cell} />,
    filterVariant: "select",
    filterFn: (row, columnId: string, filterValue: string) => {
      if (!filterValue) return true;
      if (filterValue === "*")
        return row.getValue<string[]>(columnId)?.length > 0;
      return row.getValue<string[]>(columnId)?.includes(filterValue) ?? false;
    },
    mantineFilterSelectProps: {
      data: HoldStatusEnum.options,
    },
  },
];
