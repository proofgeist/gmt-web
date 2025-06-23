"use client";
import { Drawer, Stack, Card, Group, Text, Title, Button } from "@mantine/core";
import dayjs from "dayjs";
import { toProperCase } from "@/utils/functions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMyShipmentsByGMTNumberAction } from "../../actions";
import { useEffect, useState } from "react";
import { useReleaseShipperHold } from "../hooks/use-release-shipper-hold";

export default function BookingDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingNumberFromParams = searchParams.get("bookingNumber");
  const [bookingNumber, setBookingNumber] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setBookingNumber(bookingNumberFromParams ?? null);
  }, [bookingNumberFromParams]);

  // Fetch shipment details when a booking is selected
  const { data: shipmentDetails } = useQuery({
    queryKey: ["booking-detail", bookingNumber],
    queryFn: async () => {
      if (!bookingNumber) return null;
      const result = await getMyShipmentsByGMTNumberAction({
        gmtNumber: bookingNumber,
      });
      return result?.data?.data?.fieldData ?? null;
    },
    enabled: !!bookingNumber,
  });
  const { releaseHold } = useReleaseShipperHold();
  return (
    <Drawer
      opened={!!bookingNumber}
      //remove query params
      onClose={() => router.replace(pathname)}
      position="right"
      size="md"
      title={<Text fw={700}>Shipment Details</Text>}
    >
      {shipmentDetails && (
        <Stack>
          <Card withBorder>
            <Stack>
              <Title order={4}>Reference Numbers</Title>
              <Group justify="space-between">
                <Text fw={500}>GMT Number</Text>
                <Text>{shipmentDetails["_GMT#"] || "-"}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Booking Number</Text>
                <Text>{shipmentDetails["_Booking#"]}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Shipper Reference</Text>
                <Text>{shipmentDetails["_shipperReference#"] || "-"}</Text>
              </Group>
            </Stack>
          </Card>

          <Card withBorder>
            <Stack>
              <Title order={4}>Dates</Title>
              <Group justify="space-between">
                <Text fw={500}>Sailing Date</Text>
                <Text>
                  {shipmentDetails.ETDDatePort ?
                    dayjs(shipmentDetails.ETDDatePort).format("MMM D, YYYY")
                  : "-"}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Arrival Date</Text>
                <Text>
                  {shipmentDetails.ETADatePort ?
                    dayjs(shipmentDetails.ETADatePort).format("MMM D, YYYY")
                  : "-"}
                </Text>
              </Group>
              {shipmentDetails.ETADateCity && (
                <Group justify="space-between">
                  <Text fw={500}>ETA City</Text>
                  <Text>
                    {shipmentDetails.ETADateCity ?
                      dayjs(shipmentDetails.ETADateCity).format("MMM D, YYYY")
                    : "-"}
                  </Text>
                </Group>
              )}
            </Stack>
          </Card>

          <Card withBorder>
            <Stack>
              <Title order={4}>Locations</Title>
              <Group justify="space-between">
                <Text fw={500}>Place of Receipt</Text>
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
                    .join(", ")}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Port of Loading</Text>
                <Text>
                  {toProperCase(
                    [
                      shipmentDetails.portOfLoadingCity,
                      shipmentDetails.portOfLoadingCountry,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  )}
                </Text>
              </Group>
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

          <Card withBorder>
            <Stack>
              <Title order={4}>Shipping Line Details</Title>
              <Group justify="space-between" wrap="nowrap">
                <Text fw={500}>Company</Text>
                <Text style={{ textAlign: "right" }}>
                  {toProperCase(shipmentDetails.SSLineCompany) || "-"}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Vessel</Text>
                <Text>{shipmentDetails.SSLineVessel || "-"}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Voyage</Text>
                <Text>{shipmentDetails.SSLineVoyage || "-"}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Service Contract</Text>
                <Text>
                  {shipmentDetails["SSLineCSServiceContract#"] || "-"}
                </Text>
              </Group>
            </Stack>
          </Card>

          <Card withBorder>
            <Stack>
              <Title order={4}>Shipping Line Contact</Title>
              <Group justify="space-between">
                <Text fw={500}>Website</Text>
                <Text>{shipmentDetails.SSLineCSWebsite || "-"}</Text>
              </Group>
            </Stack>
          </Card>

          {shipmentDetails.holdStatusList.length > 0 && (
            <Card withBorder>
              <Stack>
                <Title order={4}>Hold Status</Title>

                {shipmentDetails.onHoldByShipperTStamp && (
                  <Stack>
                    <Group justify="space-between">
                      <Text fw={500}>On Hold By Shipper</Text>
                      <Text>
                        {dayjs(shipmentDetails.onHoldByShipperTStamp).format(
                          "MMM D, YYYY"
                        )}
                      </Text>
                    </Group>
                    <Button
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
                      color="red"
                    >
                      Release Shipper Hold
                    </Button>
                  </Stack>
                )}
                {shipmentDetails.onHoldGmtTStamp && (
                  <Group justify="space-between">
                    <Text fw={500}>On Hold By GMT</Text>
                    <Text>
                      {dayjs(shipmentDetails.onHoldGmtTStamp).format(
                        "MMM D, YYYY"
                      )}
                    </Text>
                  </Group>
                )}
                {shipmentDetails.agentOnHoldTStamp && (
                  <Group justify="space-between">
                    <Text fw={500}>On Hold By Agent</Text>
                    <Text>
                      {dayjs(shipmentDetails.agentOnHoldTStamp).format(
                        "MMM D, YYYY"
                      )}
                    </Text>
                  </Group>
                )}
                {shipmentDetails.customsHoldTStamp && (
                  <Group justify="space-between">
                    <Text fw={500}>On Hold By Customs</Text>
                    <Text>
                      {dayjs(shipmentDetails.customsHoldTStamp).format(
                        "MMM D, YYYY"
                      )}
                    </Text>
                  </Group>
                )}
              </Stack>
            </Card>
          )}

          {shipmentDetails.SSLineInstructionsRemarks && (
            <Card withBorder>
              <Stack>
                <Title order={4}>Instructions & Remarks</Title>
                <Text>{shipmentDetails.SSLineInstructionsRemarks}</Text>
              </Stack>
            </Card>
          )}
        </Stack>
      )}
    </Drawer>
  );
}
