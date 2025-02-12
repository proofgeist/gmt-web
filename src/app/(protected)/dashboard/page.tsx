import { Group, Paper, Stack, Text, Title } from "@mantine/core";
import React from "react";

import TableContent from "./table";
import { getMyShipments } from "./actions";

export default async function TablePage() {
  const data = await getMyShipments();

  return (
    <Stack>
      <Group grow align="stretch">
        <Paper withBorder shadow="md" p={30}  radius="md">
          <Stack>
            <Title order={3}>My Shipments</Title>
            <Text>{data.length} shipments in progress</Text>
            <Text>{data.length} shipments in progress</Text>
            <Text>{data.length} shipments in progress</Text>
          </Stack>
        </Paper>
        <Paper withBorder shadow="md" p={30} radius="md">
          <Stack>
            <Title order={3}>My Quotes</Title>
            <Text>0 quotes pending</Text>
            <Text>0 quotes pending</Text>
            <Text>0 quotes pending</Text>
          </Stack>
        </Paper>
      </Group>
      <TableContent data={data.map((d) => d.fieldData)} />
    </Stack>
  );
}
