"use client";

import type { TBookings } from "@/config/schemas/filemaker/Bookings";
import { Badge, Card, Drawer, Group, Stack, Text, Title } from "@mantine/core";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import React from "react";
import dayjs from "dayjs";
import { toProperCase } from "@/utils/functions";
import { useRouter } from "next/navigation";
import { getMyShipmentsByGMTNumberAction } from "./actions";
import { useQuery } from "@tanstack/react-query";

type TData = TBookings;

const columns: MRT_ColumnDef<TData>[] = [
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
            placeOfReceiptCountry,
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

  // Fetch shipment details when a booking is selected
  const { data: shipmentDetails } = useQuery({
    queryKey: ["shipment", selectedBooking],
    queryFn: async () => {
      if (!selectedBooking) return null;
      const result = await getMyShipmentsByGMTNumberAction({
        gmtNumber: selectedBooking,
      });
      return result?.data?.data?.fieldData ?? null;
    },
    enabled: !!selectedBooking,
  });
  console.log(shipmentDetails);

  const table = useMantineReactTable({
    data: data ?? [],
    columns,
    initialState: {
      sorting: [{ id: "ETADatePort", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      selected: row.original["_Booking#"] === selectedBooking,
      sx: { cursor: "pointer" },
      onClick: () => {
        const gmtNumber = row.original["_GMT#"];
        router.push(`/my-shipments/${gmtNumber}`);
      },
    }),
  });

  return (
    <>
      <MantineReactTable table={table} />
      <Drawer
        opened={!!selectedBooking}
        onClose={() => router.push("/my-shipments")}
        position="right"
        size="md"
        title={<Text fw={700}>Shipment Details</Text>}
      >
        {shipmentDetails && (
          <Stack>
            <Card withBorder>
              <Group justify="space-between">
                <Text fw={500}>Booking Number</Text>
                <Text>{shipmentDetails["_Booking#"]}</Text>
              </Group>
            </Card>

            <Card withBorder>
              <Stack>
                <Title order={4}>Dates</Title>
                <Group justify="space-between">
                  <Text fw={500}>ETD Port</Text>
                  <Text>
                    {shipmentDetails.ETDDatePort ?
                      dayjs(shipmentDetails.ETDDatePort).format("MMM D, YYYY")
                    : "-"}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>ETA Port</Text>
                  <Text>
                    {shipmentDetails.ETADatePort ?
                      dayjs(shipmentDetails.ETADatePort).format("MMM D, YYYY")
                    : "-"}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>ETA City</Text>
                  <Text>
                    {shipmentDetails.ETADateCity ?
                      dayjs(shipmentDetails.ETADateCity).format("MMM D, YYYY")
                    : "-"}
                  </Text>
                </Group>
              </Stack>
            </Card>

            <Card withBorder>
              <Stack>
                <Title order={4}>Locations</Title>
                <Group justify="space-between">
                  <Text fw={500}>Port of Discharge</Text>
                  <Text>
                    {toProperCase(
                      [
                        shipmentDetails.portOfDischargeCity,
                        shipmentDetails.portOfDischargeCountry,
                      ]
                        .filter(Boolean)
                        .join(", ")
                    )}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Place of Delivery</Text>
                  <Text>
                    {toProperCase(
                      [
                        shipmentDetails.placeOfDeliveryCity,
                        shipmentDetails.placeOfDeliveryCountry,
                      ]
                        .filter(Boolean)
                        .join(", ")
                    )}
                  </Text>
                </Group>
              </Stack>
            </Card>
          </Stack>
        )}
      </Drawer>
    </>
  );
}
