import { Group, Image, Title } from "@mantine/core";
import React from "react";

export default function AppLogo() {
  return (
    <Group gap="xs">
      <Image
        src="/gmt_logo.png"
        alt="ProofKit"
        p={4}
        maw={42}
        height={42}
        // bg="gray.1"
        radius={"md"}
        fit="contain"
      />
      <Title visibleFrom="md" order={2} c={"brand.1"}>
        Global Marine Transportation
      </Title>
      <Title hiddenFrom="md" order={2} c={"brand.1"}>
        GMT
      </Title>
    </Group>
  );
}
