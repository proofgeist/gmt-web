"use client";
import { MRT_ColumnDef, MRT_Cell } from "mantine-react-table";
import {
  HoldStatusEnum,
  type TBookings,
} from "@/config/schemas/filemaker/Bookings";
import { Badge, Group, Text, Tooltip, Stack, Popover } from "@mantine/core";
import { CopyButton } from "@/components/ui/CopyButton";
import { toProperCase } from "@/utils/functions";
import dayjs from "dayjs";
import { IconX } from "@tabler/icons-react";
import { useReleaseShipperHold } from "@/app/(protected)/dashboard/hooks/use-release-shipper-hold";
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

function VoyageAndStatusCell({ cell }: { cell: MRT_Cell<TBookings> }) {
  const { user } = useUser();

  const { releaseHold } = useReleaseShipperHold();
  const row = cell.row.original;
  const voyageValue = row.SSLineVessel + " " + row.SSLineVoyage;
  const holdStatusList = row.holdStatusList;
  const isShipper = user?.webAccessType === "shipper";

  const visibleStatuses = holdStatusList?.slice(0, 2) || [];
  const remainingCount = holdStatusList ? Math.max(0, holdStatusList.length - 2) : 0;
  const hiddenStatuses = holdStatusList?.slice(2) || [];

  return (
    <Stack gap={3} align="flex-start">
      <Stack gap={1} align="flex-start">
        <Text c="dimmed" size="xs" lineClamp={1}>
          Vessel & Voyage
        </Text>
        <Text fw={500} lineClamp={2}>
          {voyageValue || "-"}
        </Text>
      </Stack>
      <Stack gap={1} align="flex-start">
        <Text c="dimmed" size="xs" lineClamp={1}>
          Status
        </Text>
        {holdStatusList && holdStatusList.length > 0 ? (
          <Group gap="xs" wrap="wrap" mt={1}>
            {visibleStatuses.map((status) =>
              status === "Shipper Hold" && isShipper ? (
                <Badge
                  key={status}
                  color={statusColors[status]}
                  onClick={(e) => {
                    e.stopPropagation();
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
              ) : (
                <Badge key={status} color={statusColors[status]}>
                  {status}
                </Badge>
              )
            )}
            {remainingCount > 0 && (
              <div onClick={(e) => e.stopPropagation()}>
                <Popover width={200} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <Badge
                      color="gray"
                      style={{ cursor: "pointer" }}
                    >
                      +{remainingCount}
                    </Badge>
                  </Popover.Target>
                  <Popover.Dropdown onClick={(e) => e.stopPropagation()}>
                    <Stack gap="xs">
                      {hiddenStatuses.map((status) => (
                        <Badge key={status} color={statusColors[status]} fullWidth>
                          {status}
                        </Badge>
                      ))}
                    </Stack>
                  </Popover.Dropdown>
                </Popover>
              </div>
            )}
          </Group>
        ) : <Text fw={500} c="dimmed">
          -
        </Text>}
      </Stack>
    </Stack>
  );
}
export function useBookingColumns() {
  return useMemo(() => {
    const columns: MRT_ColumnDef<TBookings>[] = [
      {
        id: "bookingNumbers",
        accessorFn: (row) => row["_GMT#"] + " - " + row["_Booking#"],
        header: "Booking",
        size: 140,
        Cell: ({ cell }) => {
          const row = cell.row.original;
          const gmtNumber = row["_GMT#"];
          const bookingNumber = row["_Booking#"];

          return (
            <Stack gap={3} align="flex-start">
              <Stack gap={1} align="flex-start">
                <Text c="dimmed" size="xs" lineClamp={1}>
                  GMT #
                </Text>
                {gmtNumber ? (
                  <CopyButton value={gmtNumber}>
                    <Text fw={500} lineClamp={1}>
                      {gmtNumber}
                    </Text>
                  </CopyButton>
                ) : (
                  <Text fw={500} c="dimmed">
                    -
                  </Text>
                )}
              </Stack>
              <Stack gap={1} align="flex-start">
                <Text c="dimmed" size="xs" lineClamp={1}>
                  Booking #
                </Text>
                {bookingNumber ? (
                  <CopyButton value={bookingNumber}>
                    <Text fw={500} lineClamp={1}>
                      {bookingNumber}
                    </Text>
                  </CopyButton>
                ) : (
                  <Text fw={500} c="dimmed">
                    -
                  </Text>
                )}
              </Stack>
            </Stack>
          );
        },
        filterVariant: "text",
        filterFn: (row, _, filterValue: string) => {
          if (!filterValue) return true;
          const filterLower = filterValue.toLowerCase();
          const gmtNumber = row.original["_GMT#"]?.toLowerCase() || "";
          const bookingNumber = row.original["_Booking#"]?.toLowerCase() || "";
          return gmtNumber.includes(filterLower) || bookingNumber.includes(filterLower);
        },
      },
      {
        id: "shipper",
        accessorFn: (row) => row["_shipperReference#"] + " - " + row["bookings_CARGO::containerNumber"],
        header: "Shipper",
        size: 140,
        Cell: ({ cell }) => {
          const row = cell.row.original;
          const shipperRef = row["_shipperReference#"];
          const containerNumber = row["bookings_CARGO::containerNumber"];

          return (
            <Stack gap={3} align="flex-start">
              <Stack gap={1} align="flex-start">
                <Text c="dimmed" size="xs" lineClamp={1}>
                  Shipper Ref
                </Text>
                {shipperRef ? (
                  <CopyButton value={shipperRef.toUpperCase()}>
                    <Text fw={500} lineClamp={1}>
                      {shipperRef.toUpperCase()}
                    </Text>
                  </CopyButton>
                ) : (
                  <Text fw={500} c="dimmed">
                    -
                  </Text>
                )}
              </Stack>
              <Stack gap={1} align="flex-start">
                <Text c="dimmed" size="xs" lineClamp={1}>
                  Container #
                </Text>
                {containerNumber ? (
                  <CopyButton value={containerNumber}>
                    <Text fw={500} lineClamp={1}>
                      {containerNumber}
                    </Text>
                  </CopyButton>
                ) : (
                  <Text fw={500} c="dimmed">
                    -
                  </Text>
                )}
              </Stack>
            </Stack>
          );
        },
        filterVariant: "text",
        filterFn: (row, _, filterValue: string) => {
          if (!filterValue) return true;
          const filterLower = filterValue.toLowerCase();
          const shipperRef = row.original["_shipperReference#"]?.toLowerCase() || "";
          const containerNumber = row.original["bookings_CARGO::containerNumber"]?.toLowerCase() || "";
          return shipperRef.includes(filterLower) || containerNumber.includes(filterLower);
        },
      },
      {
        id: "origin",
        accessorFn: (row) => row.placeOfReceiptCity + " - " + row.portOfLoadingCity,
        header: "Origin",
        size: 180,
        Cell: ({ cell }) => {
          const row = cell.row.original;
          const receiptCity = row.placeOfReceiptCity;
          const loadingCity = row.portOfLoadingCity;
          const loadingCountry = row.portOfLoadingCountry;

          return (
            <Stack gap={3} align="flex-start">
              <Stack gap={1} align="flex-start">
                <Text c="dimmed" size="xs" lineClamp={1}>
                  Receipt
                </Text>
                <Text fw={500} lineClamp={1}>
                  {receiptCity ? toProperCase(receiptCity) : <Text span fw={500} c="dimmed">
                    -
                  </Text>}
                </Text>
              </Stack>
              <Stack gap={1} align="flex-start">
                <Text c="dimmed" size="xs" lineClamp={1}>
                  Loading
                </Text>
                <Text fw={500} lineClamp={1}>
                  {loadingCity
                    ? `${toProperCase(loadingCity)}${loadingCountry ? `, ${loadingCountry}` : ""}`
                    : <Text span fw={500} c="dimmed">
                      -
                    </Text>}
                </Text>
              </Stack>
            </Stack>
          );
        },
        filterVariant: "text",
        filterFn: (row, _, filterValue: string) => {
          if (!filterValue) return true;
          const filterLower = filterValue.toLowerCase();
          const receipt = row.original.placeOfReceiptCity?.toLowerCase() || "";
          const loading = row.original.portOfLoadingCity?.toLowerCase() || "";
          return receipt.includes(filterLower) || loading.includes(filterLower);
        },
      },
      {
        id: "destination",
        accessorFn: (row) => row.portOfDischargeCity + " - " + row.placeOfDeliveryCity,
        header: "Destination",
        size: 180,
        Cell: ({ cell }) => {
          const row = cell.row.original;
          const dischargeCity = row.portOfDischargeCity;
          const dischargeCountry = row.portOfDischargeCountry;
          const deliveryCity = row.placeOfDeliveryCity;

          return (
            <Stack gap={3} align="flex-start">
              <Stack gap={1} align="flex-start">
                <Text c="dimmed" size="xs" lineClamp={1}>
                  Discharge
                </Text>
                <Text fw={500} lineClamp={1}>
                  {dischargeCity
                    ? `${toProperCase(dischargeCity)}${dischargeCountry ? `, ${dischargeCountry}` : ""}`
                    : <Text span fw={500} c="dimmed">
                      -
                    </Text>}
                </Text>
              </Stack>
              <Stack gap={1} align="flex-start">
                <Text c="dimmed" size="xs" lineClamp={1}>
                  Delivery
                </Text>
                <Text fw={500} lineClamp={1}>
                  {deliveryCity ? toProperCase(deliveryCity) : <Text span fw={500} c="dimmed">
                    -
                  </Text>}
                </Text>
              </Stack>
            </Stack>
          );
        },
        filterVariant: "text",
        filterFn: (row, _, filterValue: string) => {
          if (!filterValue) return true;
          const filterLower = filterValue.toLowerCase();
          const discharge = row.original.portOfDischargeCity?.toLowerCase() || "";
          const delivery = row.original.placeOfDeliveryCity?.toLowerCase() || "";
          return discharge.includes(filterLower) || delivery.includes(filterLower);
        },
      },
      {
        id: "dates",
        accessorFn: (row) => row.ETDDatePort + " - " + row.ETADatePort + " - " + row.maerskDepartureEventTS + " - " + row.maerskArrivalEventTS,
        header: "Dates",
        size: 150,
        Cell: ({ cell }) => {
          const row = cell.row.original;
          const etdMaersk = row.maerskDepartureEventTS;
          const etdDefault = row.ETDDatePort;
          const etdDate = etdMaersk || etdDefault;
          const etaMaersk = row.maerskArrivalEventTS;
          const etaDefault = row.ETADatePort;
          const etaDate = etaMaersk || etaDefault;
          const refreshTS = row.maerskRefreshTS;

          return (
            <Stack gap={3} align="flex-start">
              <Stack gap={1} align="flex-start">
                <Group justify="space-between" style={{ width: "100%" }}>
                  <Text c="dimmed" size="xs" lineClamp={1}>
                    ETD
                  </Text>
                  {etdDate && etdMaersk && refreshTS && (
                    <Tooltip
                      label={`Verified by Maersk: ${dayjs(refreshTS).format("M/DD/YYYY h:mm A")}`}
                      withArrow
                    >
                      <Image
                        src="/Maersk Logo.svg"
                        alt="Maersk"
                        width={12}
                        height={12}
                        style={{ cursor: "pointer" }}
                      />
                    </Tooltip>
                  )}
                </Group>
                <Text fw={500}>
                  {etdDate ? dayjs(etdDate).format("M/DD/YYYY") : <Text span fw={500} c="dimmed">
                    -
                  </Text>}
                </Text>
              </Stack>
              <Stack gap={1} align="flex-start">
                <Text c="dimmed" size="xs" lineClamp={1}>
                  ETA
                </Text>
                <Text fw={500}>
                  {etaDate ? dayjs(etaDate).format("M/DD/YYYY") : <Text span fw={500} c="dimmed">
                    -
                  </Text>}
                </Text>
              </Stack>
            </Stack>
          );
        },
        filterFn: (row, _, filterValue: string) => {
          const etdDate = row.original.maerskDepartureEventTS || row.original.ETDDatePort;
          const etaDate = row.original.maerskArrivalEventTS || row.original.ETADatePort;
          return dayjs(etdDate).isSame(dayjs(filterValue)) || dayjs(etaDate).isSame(dayjs(filterValue));
        },
        sortingFn: (a, b) => {
          const dateA = a.original.maerskArrivalEventTS || a.original.ETADatePort;
          const dateB = b.original.maerskArrivalEventTS || b.original.ETADatePort;
          return dayjs(dateA).unix() - dayjs(dateB).unix();
        },
        filterVariant: "date",
      },
      {
        id: "vesselAndStatus",
        header: "Vessel",
        enableSorting: false,
        size: 250,
        accessorFn: (row) => row.SSLineVessel + " " + row.SSLineVoyage + " - " + row.holdStatusList.join(", "),
        Cell: ({ cell }) => <VoyageAndStatusCell cell={cell} />,
        filterVariant: "text",
        filterFn: (row, columnId: string, filterValue: string) => {
          if (!filterValue) return true;
          const filterLower = filterValue.toLowerCase();
          const vessel = row.original.SSLineVessel?.toLowerCase() || "";
          const voyage = row.original.SSLineVoyage?.toLowerCase() || "";
          const statuses = row.original.holdStatusList || [];

          // Support the "*" filter for any holds (used by the Holds chip)
          if (filterValue === "*") {
            return statuses.length > 0;
          }

          // Support status filtering
          const statusMatch = statuses.some((status) =>
            status.toLowerCase().includes(filterLower)
          );
          return vessel.includes(filterLower) || voyage.includes(filterLower) || statusMatch;
        },
        mantineFilterSelectProps: {
          data: HoldStatusEnum.options,
        },
      },
    ];
    return columns;
  }, []);
}
