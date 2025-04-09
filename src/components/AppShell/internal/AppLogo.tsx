import { Group, Image, Stack, Text } from "@mantine/core";
import React from "react";

export default function AppLogo() {
  return (
    <Group gap="0">
      <Image
        src="/gmt_logo-only.png"
        alt="GMT"
        p={4}
        height={42}
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
      <Image
        src="/gmt_21-logo.png"
        alt="21"
        p={4}
        height={42}
        radius={"md"}
        fit="contain"
        visibleFrom="md"
      />
      {/* <Title order={2}>
        <Text span fz={24} className={yellowtail.className}>
          my
        </Text>
        GMT
      </Title> */}
    </Group>
  );
}
