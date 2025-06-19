"use client";

import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

import { useRouter } from "next/navigation";
import { columns } from "@/components/tables/bookings-columns";
import { Group, Title } from "@mantine/core";
import { getShipmentByTypeAction } from "../actions";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/components/auth/use-user";

interface MyTableProps {
  shipmentType: "active" | "pending" | "completed";
}

export default function MyTable({ shipmentType }: MyTableProps) {
  const router = useRouter();
  const { user } = useUser();

  // Fetch shipment details based on the selected type
  const { data, isLoading } = useQuery({
    queryKey: ["shipmentData", shipmentType],
    queryFn: async () => {
      const result = await getShipmentByTypeAction({ type: shipmentType });
      return result?.data ?? [];
    },
  });

  const table = useMantineReactTable({
    data: data ?? [],
    state: { isLoading },
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
    mantineTableBodyRowProps: ({ row }) => ({
      style: { cursor: "pointer" },
      onClick: () => {
        const gmtNumber = row.original["_GMT#"];
        router.push(`/dashboard?bookingNumber=${gmtNumber}`);
      },
    }),
    renderTopToolbarCustomActions: () => (
      <Group>
        <Title order={4} p="md">
          {`${user?.reportReferenceCustomer} ${
            shipmentType === "active" ? "Active"
            : shipmentType === "pending" ? "Pending"
            : "Completed"
          } Shipments`}
        </Title>
      </Group>
    ),
  });
  return <MantineReactTable table={table} />;
}
