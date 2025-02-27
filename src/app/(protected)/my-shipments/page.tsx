import {
  getActiveShipmentsAction,
  getPendingShipmentsAction,
  getPastShipmentsAction,
} from "../actions";
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
  const pendingShipments = await getPendingShipmentsAction({});
  const pastShipments = await getPastShipmentsAction({});

  return (
    <Stack>
      <Title order={2}>My Shipments</Title>
      <Tabs defaultValue="active" >
        <TabsList mb={"1rem"}>
          <TabsTab value="active">Active</TabsTab>
          <TabsTab value="pending">Pending</TabsTab>
          <TabsTab value="past">Past</TabsTab>
        </TabsList>
        <TabsPanel value="active">
          <TableContent data={activeShipments?.data} />
        </TabsPanel>
        <TabsPanel value="pending">
          <TableContent data={pendingShipments?.data} />
        </TabsPanel>
        <TabsPanel value="past">
          <TableContent data={pastShipments?.data} />
        </TabsPanel>
      </Tabs>
    </Stack>
  );
}
