import {
  getActiveShipmentsAction,
  getFutureShipmentsAction,
  getPastShipmentsAction,
} from "./actions";
import TableContent from "./table";
import {
  Stack,
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
  Title,
} from "@mantine/core";

export default async function TablePage() {
  const activeShipments = await getActiveShipmentsAction({});
  const futureShipments = await getFutureShipmentsAction({});
  const pastShipments = await getPastShipmentsAction({});

  return (
    <Stack>
      <Title order={2}>My Shipments</Title>
      <Tabs defaultValue="active" >
        <TabsList >
          <TabsTab value="active">Active</TabsTab>
          <TabsTab value="future">Future</TabsTab>
          <TabsTab value="past">Past</TabsTab>
        </TabsList>
        <TabsPanel value="active">
          <TableContent data={activeShipments?.data} />
        </TabsPanel>
        <TabsPanel value="future">
          <TableContent data={futureShipments?.data} />
        </TabsPanel>
        <TabsPanel value="past">
          <TableContent data={pastShipments?.data} />
        </TabsPanel>
      </Tabs>
    </Stack>
  );
}
