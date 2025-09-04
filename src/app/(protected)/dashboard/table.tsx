"use client";

import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

import { useRouter } from "next/navigation";
import { columns } from "@/components/tables/bookings-columns";
import { Chip, Group, Text } from "@mantine/core";
import { useUser } from "@/components/auth/use-user";
import useShipments from "../use-shipments";
import { ShipmentType } from "../my-shipments/schema";
import { useMemo, useState } from "react";
import { MRT_ColumnFiltersState } from "mantine-react-table";
import { IconClockX } from "@tabler/icons-react";

interface MyTableProps {
  shipmentType: ShipmentType;
}

export default function MyTable({ shipmentType }: MyTableProps) {
  const router = useRouter();
  const { user } = useUser();

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );

  // Fetch shipment details based on the selected type
  const {
    shipmentsByType: { data, isLoading, error },
  } = useShipments(shipmentType);

  const holdsCount = useMemo(() => {
    return (
      data?.filter((shipment) => shipment.holdStatusList?.length > 0).length ||
      0
    );
  }, [data]);

  const table = useMantineReactTable({
    data: data ?? [],
    state: { isLoading, columnFilters },
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
              setColumnFilters(columnFilters.filter((f) => f.id !== "holds"));
            } else {
              setColumnFilters([{ id: "holds", value: "*" }]);
            }
          }}
        >
          Holds: {holdsCount}
        </Chip>
      </Group>
    ),
  });
  return <MantineReactTable table={table} />;
}
