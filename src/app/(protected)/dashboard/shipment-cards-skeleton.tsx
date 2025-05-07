import { Group, Paper, Stack, Skeleton, Text } from "@mantine/core";
import React from "react";

export default function ShipmentCardsSkeleton({ label }: { label: string }) {
  return (
      <Paper withBorder shadow="md" p={30} radius="md">
        <Stack align="center" justify="center" gap="xs">
          <Group align="center" maw={200} w={"100%"} justify="center">
            <Skeleton height={40} circle />
          <Skeleton height={32} width={40} />
          </Group>
          <Text fz="lg" c="dimmed" ta="center">
            {label}
          </Text>
        </Stack>
      </Paper>
  );
}
