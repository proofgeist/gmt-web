"use client";

import {
  MantineReactTable,
  MRT_Row,
  MRT_TableInstance,
  useMantineReactTable,
} from "mantine-react-table";

import { useRouter } from "next/navigation";
import { useBookingColumns } from "@/components/tables/bookings-columns";
import { Chip, Group, Text, Menu } from "@mantine/core";
import { useUser } from "@/hooks/use-user";
import useShipments from "../use-shipments";
import { useShipmentStore } from "@/lib/shipments/store";
import { useMemo, useState } from "react";
import { MRT_ColumnFiltersState } from "mantine-react-table";
import type { TBookings } from "@/config/schemas/filemaker/Bookings";
import { useRequestShipperHold } from "../my-shipments/hooks/use-request-shipper-hold";
import { useReleaseShipperHold } from "../my-shipments/hooks/use-release-shipper-hold";
import { useCancelShipperHoldRequest } from "../my-shipments/hooks/use-cancel-shipper-hold";
interface MyTableProps {
  initialData?: TBookings[];
}

export default function MyTable({ initialData }: MyTableProps) {
  const { shipmentType } = useShipmentStore();
  const router = useRouter();
  const { user } = useUser();
  const isShipper = user?.webAccessType === "shipper";
  const columns = useBookingColumns();
  const { requestHold } = useRequestShipperHold();
  const { releaseHold } = useReleaseShipperHold();
  const { cancelHoldRequest } = useCancelShipperHoldRequest();
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
  

  const RowActionItems = ({
    row,
  }: {
    row: MRT_Row<TBookings>;
    table: MRT_TableInstance<TBookings>;
    renderedRowIndex?: number;
  }) => {
    return (
      <>
        <Menu.Item
          onClick={() => {
            router.push(`/dashboard?bookingNumber=${row.original["_GMT#"]}`);
          }}
        >
          View Booking
        </Menu.Item>
        <Menu.Item disabled>Download Invoice</Menu.Item>
        {isShipper && shipmentType === "active" && (
          <>
            {row.original.holdStatusList?.includes("Shipper Hold") ?
              <Menu.Item
                onClick={() => {
                  releaseHold({
                    gmt_no: row.original["_GMT#"],
                    portOfLoading: row.original.portOfLoadingCity,
                    portOfDischarge: row.original.portOfDischargeCity,
                    vesselName: row.original.SSLineCompany,
                  });
                }}
              >
                Release Shipper Hold
              </Menu.Item>
            : row.original.holdStatusList?.includes("Shipper Hold Requested") ?
              <Menu.Item
                onClick={() => {
                  cancelHoldRequest({
                    gmt_no: row.original["_GMT#"],
                  });
                }}
              >
                Cancel Hold Request
              </Menu.Item>
            : <Menu.Item
                onClick={() =>
                  requestHold({
                    gmt_no: row.original["_GMT#"],
                    portOfLoading: row.original.portOfLoadingCity,
                    portOfDischarge: row.original.portOfDischargeCity,
                    vesselName: row.original.SSLineCompany,
                  })
                }
              >
                Request Shipper Hold
              </Menu.Item>
            }
          </>
        )}
      </>
    );
  };

  const table = useMantineReactTable({
    data: data ?? [],
    state: { isLoading, columnFilters },
    onColumnFiltersChange: setColumnFilters,
    layoutMode: "grid",
    columns: columns,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableColumnActions: false,
    initialState: {
      sorting: [{ id: "ETADatePort", desc: false }],
      pagination: { pageIndex: 0, pageSize: 10 },
      density: "xs",
      showGlobalFilter: true,
    },
    defaultColumn: {
      size: 160,
    },
    mantineTableProps: {
      striped: true,
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        router.push(`/dashboard?bookingNumber=${row.original["_GMT#"]}`);
      },
      style: {
        cursor: "pointer",
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
            shipmentType === "active" ? "Active Shipments" : "Arrived Shipments"
          }`}
        </Text>

        <Group gap="sm">
          {shipmentType === "active" && (
            <Chip
              color="red"
              icon={null}
              variant="light"
              style={{ cursor: "pointer" }}
              checked={columnFilters.some(
                (filter) => filter.id === "holds" && filter.value === "*"
              )}
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
          )}
        </Group>
      </Group>
    ),
    displayColumnDefOptions: {
      "mrt-row-actions": { header: "" },
    },
  });
  return <MantineReactTable table={table} />;
}
