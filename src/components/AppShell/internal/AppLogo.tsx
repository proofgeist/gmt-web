import { Group, Image, Stack, Text } from "@mantine/core";
import React from "react";

export default function AppLogo() {
  return (
    <Group gap="0">
      <Image
        src="/gmt-icon.png"
        alt="GMT"
        p={4}
        style={{ height: "42px", width: "60px"}}
        radius={"md"}
        fit="contain"
      />

      <Stack gap={1} align="flex-end" p={4}>
        <Text fz={28} lh={1} ff="Arial Black" fw={900}>
          Global Marine
        </Text>
        <Text fz={10} lh={1} ff="Arial Black" fw={900}>
          TRANSPORTATION INC.
        </Text>
      </Stack>
    </Group>
  );
}
