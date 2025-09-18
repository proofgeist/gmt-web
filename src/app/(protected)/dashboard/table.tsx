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
import { ShipmentType } from "../my-shipments/schema";
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
  const shipmentType = useShipmentStore((state) => state.shipmentType);
  const router = useRouter();
  const { user } = useUser();
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
  const myShipmentsCount = useMemo(() => {
    return (
      data?.filter(
        (shipment) =>
          shipment["bookings_COMPANIES.shipper::reportReferenceCustomer"] ===
          user?.reportReferenceCustomer
      ).length || 0
    );
  }, [data, user?.reportReferenceCustomer]);

  const RowActionItems = ({
    row,
  }: {
    row: MRT_Row<TBookings>;
    table: MRT_TableInstance<TBookings>;
    renderedRowIndex?: number;
  }) => {
    return (
      <>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item
          onClick={() => {
            router.push(`/dashboard?bookingNumber=${row.original["_GMT#"]}`);
          }}
        >
          View Booking
        </Menu.Item>
        <Menu.Item disabled>Download Invoice</Menu.Item>
        {row.getValue<string>("isShipper") && (
          <>
            <Menu.Divider />
            <Menu.Label>Shipper Actions</Menu.Label>
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
    state: { isLoading, columnFilters, columnVisibility: { isShipper: false } },
    onColumnFiltersChange: setColumnFilters,
    layoutMode: "grid",
    columns: columns,
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
    mantineTableProps: {
      striped: true,
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
              columnFilters.find((filter) => filter.id === "isShipper")
                ?.value as string
            }
            onClick={() => {
              const currentFilter = columnFilters.find(
                (filter) => filter.id === "isShipper"
              );
              if (currentFilter?.value === true) {
                setColumnFilters(
                  columnFilters.filter((f) => f.id !== "isShipper")
                );
              } else {
                setColumnFilters([
                  ...columnFilters.filter((f) => f.id !== "isShipper"),
                  {
                    id: "isShipper",
                    value: true,
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
    renderRowActionMenuItems: RowActionItems,
    positionActionsColumn: "last",
    displayColumnDefOptions: {
      "mrt-row-actions": { header: "" },
    },
  });
  return <MantineReactTable table={table} />;
}
