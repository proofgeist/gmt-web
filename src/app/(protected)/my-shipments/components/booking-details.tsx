import { Drawer, Stack, Card, Group, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { toProperCase } from "@/utils/functions";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMyShipmentsByGMTNumberAction } from "../actions";

export default function BookingDetails({
  selectedBooking,
}: {
  selectedBooking: string | undefined;
}) {
  const router = useRouter();

  // Fetch shipment details when a booking is selected
  const { data: shipmentDetails } = useQuery({
    queryKey: ["shipment", selectedBooking],
    queryFn: async () => {
      if (!selectedBooking) return null;
      const result = await getMyShipmentsByGMTNumberAction({
        gmtNumber: selectedBooking,
      });
      return result?.data?.data?.fieldData ?? null;
    },
    enabled: !!selectedBooking,
  });
  return (
    <Drawer
      opened={!!selectedBooking}
      onClose={() => router.push("/my-shipments")}
      position="right"
      size="md"
      title={<Text fw={700}>Shipment Details</Text>}
    >
      {shipmentDetails && (
        <Stack>
          <Card withBorder>
            <Group justify="space-between">
              <Text fw={500}>Booking Number</Text>
              <Text>{shipmentDetails["_Booking#"]}</Text>
            </Group>
          </Card>

          <Card withBorder>
            <Stack>
              <Title order={4}>Dates</Title>
              <Group justify="space-between">
                <Text fw={500}>ETD Port</Text>
                <Text>
                  {shipmentDetails.ETDDatePort ?
                    dayjs(shipmentDetails.ETDDatePort).format("MMM D, YYYY")
                  : "-"}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>ETA Port</Text>
                <Text>
                  {shipmentDetails.ETADatePort ?
                    dayjs(shipmentDetails.ETADatePort).format("MMM D, YYYY")
                  : "-"}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>ETA City</Text>
                <Text>
                  {shipmentDetails.ETADateCity ?
                    dayjs(shipmentDetails.ETADateCity).format("MMM D, YYYY")
                  : "-"}
                </Text>
              </Group>
            </Stack>
          </Card>

          <Card withBorder>
            <Stack>
              <Title order={4}>Locations</Title>
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
        </Stack>
      )}
    </Drawer>
  );
}
