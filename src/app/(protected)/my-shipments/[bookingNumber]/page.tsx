import { getMyShipmentsAction } from "../actions";
import TableContent from "../table";
import { Stack, Title } from "@mantine/core";

export default async function TablePage({
  params,
}: {
  params: Promise<{ bookingNumber: string }>;
}) {
  const result = await getMyShipmentsAction({});
  const shipments = result?.data?.map((record) => record.fieldData);
  const { bookingNumber } = await params;

  return (
    <Stack>
      <Title order={2}>My Shipments</Title>
      <TableContent data={shipments} selectedBooking={bookingNumber} />
    </Stack>
  );
}
