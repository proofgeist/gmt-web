"use client";
import {
  Modal,
  Stack,
  Card,
  Group,
  Text,
  Title,
  Button,
  Tooltip,
  SimpleGrid,
  Divider,
  Badge,
  ScrollArea,
  Loader,
  Box,
  Image,
  Table,
  TableThead,
  TableTbody,
  TableTr,
  TableTd,
  TableTh,
  Menu,
  MenuTarget,
  MenuDropdown,
  MenuItem,
} from "@mantine/core";
import dayjs from "dayjs";
import { toProperCase } from "@/utils/functions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useReleaseShipperHold } from "@/app/(protected)/dashboard/hooks/use-release-shipper-hold";
import { useRequestShipperHold } from "@/app/(protected)/dashboard/hooks/use-request-shipper-hold";
import { useCancelShipperHoldRequest } from "@/app/(protected)/dashboard/hooks/use-cancel-shipper-hold";
import { IconLock, IconLockOpen, IconDownload, IconFile } from "@tabler/icons-react";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { useBookingDetails } from "@/app/(protected)/dashboard/hooks/use-booking-details";
import { useDownloadBookingConfirmation } from "@/app/(protected)/dashboard/hooks/use-download-booking-confirmation";

export default function BookingDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingNumberFromParams = searchParams.get("bookingNumber");
  const [bookingNumber, setBookingNumber] = useState<string | null>(null);
  const pathname = usePathname();
  const { user } = useUser();
  const isShipper = user?.webAccessType === "shipper";
  const isAgent = user?.webAccessType === "agent";
  useEffect(() => {
    setBookingNumber(bookingNumberFromParams ?? null);
  }, [bookingNumberFromParams]);

  const { data: shipmentDetails, isLoading } = useBookingDetails(bookingNumber);

  const { releaseHold } = useReleaseShipperHold();
  const { requestHold } = useRequestShipperHold();
  const { cancelHoldRequest } = useCancelShipperHoldRequest();
  const { downloadConfirmation, isPending: isDownloading } =
    useDownloadBookingConfirmation();
  return (
    <Modal
      opened={!!bookingNumber}
      onClose={() => router.replace(pathname)}
      styles={{
        title: {
          width: "100%",
        },
      }}
      title={
        <Group justify="space-between" wrap="nowrap" style={{ width: "100%" }}>
          <Text fw={700} size="xl">
            Shipment Details
          </Text>
          {isAgent &&
            <Box style={{ marginLeft: "auto", marginRight: "10px" }}>
              <Menu shadow="md" width={200} position="bottom-end">
                <MenuTarget>
                  <Button
                    variant="subtle"
                    color="dark"
                    leftSection={<IconDownload size={18} />}
                    size="sm"
                  >
                    Downloads
                  </Button>
                </MenuTarget>
                <MenuDropdown>
                  {shipmentDetails && (
                    <MenuItem
                      leftSection={isDownloading ? <Loader size="sm" /> : <IconFile size={16} />}
                      onClick={() => {
                        downloadConfirmation(shipmentDetails["_GMT#"]);
                      }}
                      disabled={isDownloading}
                      closeMenuOnClick={false}
                    >
                      {isDownloading ? "Downloading..." : "Booking Confirmation"}
                    </MenuItem>
                  )}
                </MenuDropdown>
              </Menu>
            </Box>}
        </Group>
      }
      size="xl"
      centered
      scrollAreaComponent={ScrollArea.Autosize}
    >
      {isLoading ?
        <Box
          style={{
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader size="md" />
        </Box>
        : shipmentDetails ?
          <Stack gap="md">
            {/* Header with Key Reference Numbers */}
            <Card withBorder padding="md" radius="md">
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <Stack gap={4}>
                  <Text size="sm" fw={500} c="dimmed">
                    GMT Number
                  </Text>
                  <Text fw={600} size="lg">
                    {shipmentDetails["_GMT#"] || "-"}
                  </Text>
                </Stack>
                <Stack gap={4}>
                  <Text size="sm" fw={500} c="dimmed">
                    Booking Number
                  </Text>
                  <Text fw={600} size="lg">
                    {shipmentDetails["_Booking#"]}
                  </Text>
                </Stack>
                <Stack gap={4}>
                  <Text size="sm" fw={500} c="dimmed">
                    Shipper Reference
                  </Text>
                  <Text fw={600} size="lg">
                    {shipmentDetails["_shipperReference#"] || "-"}
                  </Text>
                </Stack>
              </SimpleGrid>
            </Card>

            {/* Main Content Grid */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              {/* Dates Section */}
              <Card withBorder padding="md" radius="md">
                <Stack gap="sm">
                  <Group justify="space-between" wrap="nowrap">
                    <Title order={4}>Dates</Title>
                    {shipmentDetails.maerskRefreshTS && (
                      <Tooltip
                        label={`Verified on: ${dayjs(shipmentDetails.maerskRefreshTS).format("MMM D, YYYY h:mm A")}`}
                        withArrow
                      >
                        <Link
                          href={`https://www.maersk.com/tracking/${shipmentDetails["_Booking#"]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            textDecoration: "none",
                          }}
                        >
                          <Group gap="xs" wrap="nowrap">
                            <Text size="sm" fw={500} c="dimmed">
                              Verified by Maersk
                            </Text>
                            <Image
                              src="/Maersk Logo.svg"
                              alt="Maersk"
                              width={16}
                              height={16}
                              style={{ cursor: "pointer" }}
                            />
                          </Group>
                        </Link>
                      </Tooltip>
                    )}
                  </Group>
                  <Divider />
                  <Stack gap="xs">
                    <Group justify="space-between" wrap="nowrap">
                      <Text size="sm" fw={500} c="dimmed">
                        Sailing Date (ETD)
                      </Text>
                      {(() => {
                        const maerskDate = shipmentDetails.maerskDepartureEventTS;
                        const defaultDate = shipmentDetails.ETDDatePort;
                        const dateToShow = maerskDate || defaultDate;

                        return (
                          <Group gap="xs" align="center" wrap="nowrap">
                            <Text fw={500}>
                              {dateToShow ?
                                dayjs(dateToShow).format("MMM D, YYYY")
                                : "-"}
                            </Text>
                          </Group>
                        );
                      })()}
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                      <Text size="sm" fw={500} c="dimmed">
                        Arrival Date (ETA)
                      </Text>
                      {(() => {
                        const maerskDate = shipmentDetails.maerskArrivalEventTS;
                        const defaultDate = shipmentDetails.ETADatePort;
                        const dateToShow = maerskDate || defaultDate;

                        return (
                          <Group gap="xs" align="center" wrap="nowrap">
                            <Text fw={500}>
                              {dateToShow ?
                                dayjs(dateToShow).format("MMM D, YYYY")
                                : "-"}
                            </Text>
                          </Group>
                        );
                      })()}
                    </Group>
                    {shipmentDetails.ETADateCity && (
                      <Group justify="space-between" wrap="nowrap">
                        <Text size="sm" fw={500} c="dimmed">
                          ETA City
                        </Text>
                        <Text fw={500}>
                          {shipmentDetails.ETADateCity ?
                            dayjs(shipmentDetails.ETADateCity).format(
                              "MMM D, YYYY"
                            )
                            : "-"}
                        </Text>
                      </Group>
                    )}
                  </Stack>
                </Stack>
              </Card>

              {/* Shipping Line Details */}
              <Card withBorder padding="md" radius="md">
                <Stack gap="sm">
                  <Title order={4}>Shipping Line</Title>
                  <Divider />
                  <Stack gap="xs">
                    <Group justify="space-between" wrap="nowrap">
                      <Text size="sm" fw={500} c="dimmed">
                        Company
                      </Text>
                      <Text fw={500} style={{ textAlign: "right" }}>
                        {toProperCase(shipmentDetails.SSLineCompany) || "-"}
                      </Text>
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                      <Text size="sm" fw={500} c="dimmed">
                        Vessel
                      </Text>
                      <Text fw={500}>{shipmentDetails.SSLineVessel || "-"}</Text>
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                      <Text size="sm" fw={500} c="dimmed">
                        Voyage
                      </Text>
                      <Text fw={500}>{shipmentDetails.SSLineVoyage || "-"}</Text>
                    </Group>
                  </Stack>
                </Stack>
              </Card>
            </SimpleGrid>

            {/* Locations Section - Full Width */}
            <Card withBorder padding="md" radius="md">
              <Stack gap="sm">
                <Title order={4}>Locations</Title>
                <Divider />
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                  <Stack gap={4}>
                    <Text size="sm" fw={500} c="dimmed">
                      Place of Receipt
                    </Text>
                    <Text>
                      {[
                        toProperCase(shipmentDetails.placeOfReceiptCity),
                        [
                          shipmentDetails.placeOfReceiptState,
                          shipmentDetails.placeOfReceiptZipCode,
                        ]
                          .filter(Boolean)
                          .join(" "),
                        toProperCase(shipmentDetails.placeOfReceiptCountry),
                      ]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </Text>
                  </Stack>
                  <Stack gap={4}>
                    <Text size="sm" fw={500} c="dimmed">
                      Port of Loading
                    </Text>
                    <Text>
                      {toProperCase(
                        [
                          shipmentDetails.portOfLoadingCity,
                          shipmentDetails.portOfLoadingCountry,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      ) || "-"}
                    </Text>
                  </Stack>
                  <Stack gap={4}>
                    <Text size="sm" fw={500} c="dimmed">
                      Port of Discharge
                    </Text>
                    <Text>
                      {toProperCase(
                        [
                          shipmentDetails.portOfDischargeCity,
                          shipmentDetails.portOfDischargeCountry,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      ) || "-"}
                    </Text>
                  </Stack>
                  <Stack gap={4}>
                    <Text size="sm" fw={500} c="dimmed">
                      Place of Delivery
                    </Text>
                    <Text>
                      {toProperCase(
                        [
                          shipmentDetails.placeOfDeliveryCity,
                          shipmentDetails.placeOfDeliveryCountry,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      ) || "-"}
                    </Text>
                  </Stack>
                </SimpleGrid>
              </Stack>
            </Card>

            {/* Status Section */}
            {shipmentDetails.holdStatusList.length > 0 &&
              (() => {
                const holdStatusCount = [
                  shipmentDetails.onHoldByShipperTStamp,
                  shipmentDetails.onHoldByShipperRequestedTStamp,
                  shipmentDetails.agentOnHoldTStamp,
                  shipmentDetails.customsHoldTStamp,
                ].filter(Boolean).length;

                return (
                  <Card withBorder padding="md" radius="md">
                    <Stack gap="sm">
                      <Title order={4}>Hold Status</Title>
                      <Divider />
                      <SimpleGrid
                        cols={{ base: 1, sm: holdStatusCount > 1 ? 2 : 1 }}
                        spacing="xs"
                      >
                        {shipmentDetails.onHoldByShipperTStamp &&
                          (isShipper ?
                            <Group
                              justify="space-between"
                              align="center"
                              wrap="nowrap"
                            >
                              <Group gap="xs" wrap="nowrap">
                                <Badge color="red" variant="light">
                                  On Hold By Shipper
                                </Badge>
                                <Text size="sm" c="dimmed">
                                  {dayjs(
                                    shipmentDetails.onHoldByShipperTStamp
                                  ).format("MMM D, YYYY")}
                                </Text>
                              </Group>
                              <Tooltip label="Release Shipper Hold" withArrow>
                                <Button
                                  size="sm"
                                  color="red"
                                  leftSection={<IconLockOpen size={16} />}
                                  onClick={() => {
                                    releaseHold({
                                      gmt_no: shipmentDetails["_GMT#"],
                                      portOfLoading: [
                                        shipmentDetails.portOfLoadingCity,
                                        shipmentDetails.portOfLoadingCountry,
                                      ]
                                        .filter(Boolean)
                                        .join(", "),
                                      portOfDischarge: [
                                        shipmentDetails.portOfDischargeCity,
                                        shipmentDetails.portOfDischargeCountry,
                                      ]
                                        .filter(Boolean)
                                        .join(", "),
                                      vesselName: shipmentDetails.SSLineVessel,
                                    });
                                  }}
                                  variant="light"
                                >
                                  Release
                                </Button>
                              </Tooltip>
                            </Group>
                            : <Group justify="space-between" wrap="nowrap">
                              <Badge color="red" variant="light">
                                On Hold By Shipper
                              </Badge>
                              <Text size="sm">
                                {dayjs(
                                  shipmentDetails.onHoldByShipperTStamp
                                ).format("MMM D, YYYY")}
                              </Text>
                            </Group>)}
                        {shipmentDetails.onHoldByShipperRequestedTStamp &&
                          (isShipper ?
                            <Group
                              justify="space-between"
                              align="center"
                              wrap="nowrap"
                            >
                              <Group gap="xs" wrap="nowrap">
                                <Badge color="yellow" variant="light">
                                  Shipper Hold Requested
                                </Badge>
                                <Text size="sm" c="dimmed">
                                  {dayjs(
                                    shipmentDetails.onHoldByShipperRequestedTStamp
                                  ).format("MMM D, YYYY")}
                                </Text>
                              </Group>
                              <Tooltip
                                label="Cancel Shipper Hold Request"
                                withArrow
                              >
                                <Button
                                  size="sm"
                                  color="yellow"
                                  leftSection={<IconLockOpen size={16} />}
                                  onClick={() => {
                                    cancelHoldRequest({
                                      gmt_no: shipmentDetails["_GMT#"],
                                    });
                                  }}
                                  variant="light"
                                >
                                  Cancel
                                </Button>
                              </Tooltip>
                            </Group>
                            : <Group justify="space-between" wrap="nowrap">
                              <Badge color="yellow" variant="light">
                                Shipper Hold Requested
                              </Badge>
                              <Text size="sm">
                                {dayjs(
                                  shipmentDetails.onHoldByShipperRequestedTStamp
                                ).format("MMM D, YYYY")}
                              </Text>
                            </Group>)}

                        {shipmentDetails.agentOnHoldTStamp && (
                          <Group justify="space-between" wrap="nowrap">
                            <Badge color="blue" variant="light">
                              On Hold By Agent
                            </Badge>
                            <Text size="sm">
                              {dayjs(shipmentDetails.agentOnHoldTStamp).format(
                                "MMM D, YYYY"
                              )}
                            </Text>
                          </Group>
                        )}
                        {shipmentDetails.customsHoldTStamp && (
                          <Group justify="space-between" wrap="nowrap">
                            <Badge color="purple" variant="light">
                              On Hold By Customs
                            </Badge>
                            <Text size="sm">
                              {dayjs(shipmentDetails.customsHoldTStamp).format(
                                "MMM D, YYYY"
                              )}
                            </Text>
                          </Group>
                        )}
                      </SimpleGrid>
                    </Stack>
                  </Card>
                );
              })()}


            {/* Shipper Actions */}
            {isShipper && (
              <Card withBorder padding="md" radius="md">
                <Stack gap="sm">
                  <Title order={4}>Actions</Title>
                  <Divider />
                  <Group justify="flex-end">
                    {shipmentDetails.holdStatusList?.includes("Shipper Hold") ?
                      <Button
                        size="md"
                        color="red"
                        leftSection={<IconLockOpen size={18} />}
                        onClick={() => {
                          releaseHold({
                            gmt_no: shipmentDetails["_GMT#"],
                            portOfLoading: shipmentDetails.portOfLoadingCity,
                            portOfDischarge: shipmentDetails.portOfDischargeCity,
                            vesselName: shipmentDetails.SSLineCompany,
                          });
                        }}
                        variant="light"
                      >
                        Release Hold
                      </Button>
                      : (
                        shipmentDetails.holdStatusList?.includes(
                          "Shipper Hold Requested"
                        )
                      ) ?
                        <Button
                          size="md"
                          color="yellow"
                          leftSection={<IconLockOpen size={18} />}
                          onClick={() => {
                            cancelHoldRequest({
                              gmt_no: shipmentDetails["_GMT#"],
                            });
                          }}
                          variant="light"
                        >
                          Cancel Hold Request
                        </Button>
                        : <Button
                          size="md"
                          color="blue"
                          leftSection={<IconLock size={18} />}
                          onClick={() => {
                            requestHold({
                              gmt_no: shipmentDetails["_GMT#"],
                              portOfLoading: shipmentDetails.portOfLoadingCity,
                              portOfDischarge: shipmentDetails.portOfDischargeCity,
                              vesselName: shipmentDetails.SSLineCompany,
                            });
                          }}
                          variant="light"
                        >
                          Request Hold
                        </Button>
                    }
                  </Group>
                </Stack>
              </Card>
            )}

            {/* Instructions & Remarks */}
            {shipmentDetails.SSLineInstructionsRemarks && (
              <Card withBorder padding="md" radius="md">
                <Stack gap="sm">
                  <Title order={4}>Instructions & Remarks</Title>
                  <Divider />
                  <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                    {shipmentDetails.SSLineInstructionsRemarks}
                  </Text>
                </Stack>
              </Card>
            )}

            {/* Cargo Section */}
            {shipmentDetails.cargo && shipmentDetails.cargo.length > 0 && (
              <Card withBorder padding="md" radius="md">
                <Stack gap="sm">
                  <Title order={4}>Cargo</Title>
                  <Divider />
                  <Table
                    striped
                    highlightOnHover
                    withTableBorder
                    withColumnBorders
                  >
                    <TableThead>
                      <TableTr>
                        <TableTh>Container Number</TableTh>
                        <TableTh>Size</TableTh>
                        <TableTh>Seal Number</TableTh>
                      </TableTr>
                    </TableThead>
                    <TableTbody>
                      {shipmentDetails.cargo.map((item, index) => (
                        <TableTr key={index}>
                          <TableTd>
                            {item["bookings_CARGO::containerNumber"] || "-"}
                          </TableTd>
                          <TableTd>{item["bookings_CARGO::size"] || "-"}</TableTd>
                          <TableTd>
                            {item["bookings_CARGO::sealNumber"] || "-"}
                          </TableTd>
                        </TableTr>
                      ))}
                    </TableTbody>
                  </Table>
                </Stack>
              </Card>
            )}
          </Stack>
          : null}
    </Modal>
  );
}
