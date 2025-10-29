"use client";
import { MRT_ColumnDef, MRT_Cell } from "mantine-react-table";
import {
  HoldStatusEnum,
  type TBookings,
} from "@/config/schemas/filemaker/Bookings";
import { Badge, Group, Text, Tooltip } from "@mantine/core";
import { toProperCase } from "@/utils/functions";
import dayjs from "dayjs";
import { IconShip, IconX } from "@tabler/icons-react";
import { useReleaseShipperHold } from "@/app/(protected)/my-shipments/hooks/use-release-shipper-hold";
import { useUser } from "@/hooks/use-user";
import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

const statusColors: Record<typeof HoldStatusEnum.options[number], string> = {
  "Shipper Hold": "red",
  "Shipper Hold Requested": "yellow",
  "Finance Hold": "blue",
  "Agent Hold": "purple",
  "Customs Hold": "orange",
  "Vendor Hold": "green",
} as const;
function HoldsCell({ cell }: { cell: MRT_Cell<TBookings> }) {
  const { releaseHold } = useReleaseShipperHold();
  const value = cell.getValue<TBookings["holdStatusList"]>();
  const isShipper = cell.row.getValue<string>("isShipper");
  if (!value) return null;

  return (
    <Group gap="xs">
      {value.length > 0 &&
        value.map((status) =>
          status === "Shipper Hold" && isShipper ?
            <Badge
              key={status}
              color={statusColors[status]}
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
          : <Badge key={status} color={statusColors[status]}>
              {status}
            </Badge>
        )}
    </Group>
  );
}
export function useBookingColumns() {
  const { user } = useUser();

  return useMemo(() => {
    const columns: MRT_ColumnDef<TBookings>[] = [
      {
        accessorKey: "_GMT#",
        header: "GMT #",
        enableClickToCopy: true,
        grow: false,
        size: 100,
      },
      {
        accessorKey: "_Booking#",
        header: "Booking #",
        enableClickToCopy: true,
        filterVariant: "text",
        grow: false,
        size: 120,
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
          const dateToUse =
            row.original.maerskDepartureEventTS || row.original.ETDDatePort;
          return dayjs(dateToUse).isSame(dayjs(filterValue));
        },
        sortingFn: (a, b) => {
          const dateA =
            a.original.maerskDepartureEventTS || a.original.ETDDatePort;
          const dateB =
            b.original.maerskDepartureEventTS || b.original.ETDDatePort;
          return dayjs(dateA).unix() - dayjs(dateB).unix();
        },
        Cell: ({ cell }) => {
          const row = cell.row.original;
          const maerskDate = row.maerskDepartureEventTS;
          const defaultDate = cell.getValue<string | null>();
          const dateToShow = maerskDate || defaultDate;
          const refreshTS = row.maerskRefreshTS;

          return (
            dateToShow && (
              <Group gap="xs" align="center">
                <Text>{dayjs(dateToShow).format("M/DD/YYYY")}</Text>
                {maerskDate && refreshTS && (
                  <Tooltip
                    label={`Verified by Maersk: ${dayjs(refreshTS).format("M/DD/YYYY h:mm A")}`}
                    withArrow
                  >
                    <Link
                      href={`https://www.maersk.com/tracking/${row["_Booking#"]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <Image
                        src="/Maersk Logo.svg"
                        alt="Maersk"
                        width={16}
                        height={16}
                        style={{ cursor: "pointer" }}
                      />
                    </Link>
                  </Tooltip>
                )}
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
          const dateToUse =
            row.original.maerskArrivalEventTS || row.original.ETADatePort;
          return dayjs(dateToUse).isSame(dayjs(filterValue));
        },
        sortingFn: (a, b) => {
          const dateA =
            a.original.maerskArrivalEventTS || a.original.ETADatePort;
          const dateB =
            b.original.maerskArrivalEventTS || b.original.ETADatePort;
          return dayjs(dateA).unix() - dayjs(dateB).unix();
        },
        Cell: ({ cell }) => {
          const row = cell.row.original;
          const maerskDate = row.maerskArrivalEventTS;
          const defaultDate = cell.getValue<string | null>();
          const dateToShow = maerskDate || defaultDate;
          const refreshTS = row.maerskRefreshTS;

          return (
            dateToShow && (
              <Group gap="xs" align="center">
                <Text>{dayjs(dateToShow).format("M/DD/YYYY")}</Text>
                {maerskDate && refreshTS && (
                  <Tooltip
                    label={`Verified by Maersk: ${dayjs(refreshTS).format("M/DD/YYYY h:mm A")}`}
                    withArrow
                  >
                    <Link
                      href={`https://www.maersk.com/tracking/${row["_Booking#"]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <Image
                        src="/Maersk Logo.svg"
                        alt="Maersk"
                        width={16}
                        height={16}
                        style={{ cursor: "pointer" }}
                      />
                    </Link>
                  </Tooltip>
                )}
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
        grow: true,
        filterFn: (row, columnId: string, filterValue: string) => {
          if (!filterValue) return true;
          if (filterValue === "*")
            return row.getValue<string[]>(columnId)?.length > 0;
          return (
            row.getValue<string[]>(columnId)?.includes(filterValue) ?? false
          );
        },
        mantineFilterSelectProps: {
          data: HoldStatusEnum.options,
        },
      },
    ];
    return columns;
  }, [user]);
}
