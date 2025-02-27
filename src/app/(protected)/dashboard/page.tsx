import { Group, Paper, Stack, Text, Title } from "@mantine/core";
import React from "react";

import TableContent from "./table";
import { getActiveShipmentsAction, getPendingShipmentsAction, getPastShipmentsAction } from "../actions";

export default async function TablePage() {
    const activeShipments = await getActiveShipmentsAction({});
    const pendingShipments = await getPendingShipmentsAction({});
    const pastShipments = await getPastShipmentsAction({});


  return (
    <Stack>
      <Group grow align="stretch">
        <Paper withBorder shadow="md" p={30}  radius="md">
          <Stack>
            <Title order={3}>My Shipments</Title>
            <Text>{activeShipments?.data?.length} shipments in progress</Text>
            <Text>{pendingShipments?.data?.length} shipments pending</Text>
            <Text>{pastShipments?.data?.length} shipments completed</Text>
          </Stack>
        </Paper>
        <Paper withBorder shadow="md" p={30} radius="md">
          <Stack>
            <Title order={3}>My Quotes</Title>
            <Text>0 quotes pending</Text>
          </Stack>
        </Paper>
      </Group>
      <TableContent />
    </Stack>
  );
}
