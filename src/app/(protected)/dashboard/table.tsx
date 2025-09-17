"use client";

import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

import { useRouter } from "next/navigation";
import { columns } from "@/components/tables/bookings-columns";
import { Chip, Group, Text, Menu } from "@mantine/core";
import { useUser } from "@/components/auth/use-user";
import useShipments from "../use-shipments";
import { ShipmentType } from "../my-shipments/schema";
import { useShipmentStore } from "@/lib/shipments/store";
import { useMemo, useState } from "react";
import { MRT_ColumnFiltersState } from "mantine-react-table";
import type { TBookings } from "@/config/schemas/filemaker/Bookings";

interface MyTableProps {
  initialData?: TBookings[];
}

export default function MyTable({ initialData }: MyTableProps) {
  const shipmentType = useShipmentStore((state) => state.shipmentType);
  const router = useRouter();
  const { user } = useUser();

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );

  // Fetch shipment details based on the selected type
  const {
    shipmentsByType: { data, isLoading, error: _error },
  } = useShipments(shipmentType, initialData);

  const holdsCount = useMemo(() => {
    return (
      data?.filter((shipment) => shipment.holdStatusList?.length > 0).length ||
      0
    );
  }, [data]);
  const myShipmentsCount = useMemo(() => {
    return (
      data?.filter(
        (shipment) =>
          shipment["bookings_COMPANIES.shipper::reportReferenceCustomer"] ===
          user?.reportReferenceCustomer
      ).length || 0
    );
  }, [data, user?.reportReferenceCustomer]);

  const table = useMantineReactTable({
    data: data ?? [],
    state: { isLoading, columnFilters, columnVisibility: { rrShipper: false } },
    onColumnFiltersChange: setColumnFilters,
    layoutMode: "grid",
    columns,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableColumnActions: false,
    initialState: {
      sorting: [{ id: "ETADatePort", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      density: "xs",
      showGlobalFilter: true,
    },
    defaultColumn: {
      size: 160,
    },
    mantineTableBodyRowProps: ({ row }) => ({
      style: { cursor: "pointer" },
      onClick: () => {
        const gmtNumber = row.original["_GMT#"];
        router.push(`/dashboard?bookingNumber=${gmtNumber}`);
      },
    }),
    renderTopToolbarCustomActions: () => (
      <Group
        justify="space-between"
        m="auto"
        style={{ flexGrow: 1, alignItems: "center" }}
      >
        <Text size="lg">
          <strong>{user?.reportReferenceCustomer}</strong>
          {` ${
            shipmentType === "active" ? "In-Transit Shipments"
            : shipmentType === "pending" ? "Scheduled to Sail Shipments"
            : "Previous Shipments"
          }`}
        </Text>

        <Group gap="sm">
          <Chip
            color="blue"
            icon={null}
            variant="light"
            style={{ cursor: "pointer" }}
            value={
              columnFilters.find((filter) => filter.id === "rrShipper")
                ?.value as string
            }
            onClick={() => {
              const currentFilter = columnFilters.find(
                (filter) => filter.id === "rrShipper"
              );
              if (currentFilter?.value === user?.reportReferenceCustomer) {
                setColumnFilters(
                  columnFilters.filter((f) => f.id !== "rrShipper")
                );
              } else {
                setColumnFilters([
                  ...columnFilters.filter((f) => f.id !== "rrShipper"),
                  {
                    id: "rrShipper",
                    value: user?.reportReferenceCustomer,
                  },
                ]);
              }
            }}
            disabled={myShipmentsCount === 0}
          >
            My Shipments: {myShipmentsCount}
          </Chip>

          {
            <Chip
              color="red"
              icon={null}
              variant="light"
              style={{ cursor: "pointer" }}
              value={
                columnFilters.find((filter) => filter.id === "holds")
                  ?.value as string
              }
              onClick={() => {
                const currentFilter = columnFilters.find(
                  (filter) => filter.id === "holds"
                );
                if (currentFilter?.value && currentFilter.value === "*") {
                  setColumnFilters(
                    columnFilters.filter((f) => f.id !== "holds")
                  );
                } else {
                  setColumnFilters([
                    ...columnFilters.filter((f) => f.id !== "holds"),
                    { id: "holds", value: "*" },
                  ]);
                }
              }}
              disabled={holdsCount === 0}
            >
              Holds: {holdsCount}
            </Chip>
          }
        </Group>
      </Group>
    ),
    enableRowActions: true,
    renderRowActionMenuItems: ({ row }) => (
      <>
        <Menu.Item onClick={() => console.info("Edit")}>
          Request Shipper Hold
        </Menu.Item>
      </>
    ),
    positionActionsColumn: "last",
  });
  return <MantineReactTable table={table} />;
}
