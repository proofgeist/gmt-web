import { getMyShipmentsAction } from "./actions";
import TableContent from "./table";
import { Stack, Title } from "@mantine/core";

export default async function TablePage() {
  const result = await getMyShipmentsAction({});
  const shipments = result?.data?.map((record) => record.fieldData);

  return (
    <Stack>
      <Title order={2}>My Shipments</Title>
      <TableContent data={shipments} />
    </Stack>
  );
}
