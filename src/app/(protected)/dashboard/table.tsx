"use client";

import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import  { useState } from "react";

import { useRouter } from "next/navigation";
import { columns } from "../my-shipments/table";
import { Group, SegmentedControl, Title } from "@mantine/core";
import { getShipmentByTypeAction } from "../actions";
import { useQuery } from "@tanstack/react-query";


export default function MyTable() {
  const router = useRouter();
  const [value, setValue] = useState<"active" | "pending" | "completed">(
    "active"
  );

  // Fetch shipment details when a booking is selected
  const { data, isLoading } = useQuery({
    queryKey: ["shipmentData", value],
    queryFn: async () => {
      const result = await getShipmentByTypeAction({ type: value });
      return result?.data ?? [];
    },
  });

  const table = useMantineReactTable({
    data: data ?? [],
    state: { isLoading },
    columns,
    enableFullScreenToggle: false,
    enableHiding: false,
    // enableDensityToggle: false,
    enableColumnActions: false,
    initialState: {
      sorting: [{ id: "ETADatePort", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
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
          Shipment Details
        </Title>
        <SegmentedControl
          value={value}
          onChange={(val) =>
            setValue(val as "active" | "pending" | "completed")
          }
          data={[
            { label: "Active", value: "active" },
            { label: "Pending", value: "pending" },
            { label: "Completed", value: "completed" },
          ]}
        />
      </Group>
    ),
  });
  return <MantineReactTable table={table} />;
}
