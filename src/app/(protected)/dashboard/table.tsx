"use client";

import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

import { useRouter } from "next/navigation";
import { columns } from "@/components/tables/bookings-columns";
import { Group, Text } from "@mantine/core";
import { useUser } from "@/components/auth/use-user";
import useShipments from "../use-shipments";

interface MyTableProps {
  shipmentType: "active" | "pending" | "completed";
}

export default function MyTable({ shipmentType }: MyTableProps) {
  const router = useRouter();
  const { user } = useUser();

  // Fetch shipment details based on the selected type
  const {
    shipmentsByType: { data, isLoading, error },
  } = useShipments(shipmentType);


  const table = useMantineReactTable({
    data: data ?? [],
    state: { isLoading },
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
      <Group>
        <Text size="lg" p="md">
          <strong>{user?.reportReferenceCustomer}</strong>
          {` ${
            shipmentType === "active" ? "In-Transit Shipments"
            : shipmentType === "pending" ? "Scheduled to Sail Shipments"
            : "Previous Shipments"
          }`}
        </Text>
      </Group>
    ),
  });
  return <MantineReactTable table={table} />;
}
