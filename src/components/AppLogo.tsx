import { IconInfinity } from "@tabler/icons-react";
import { Group, Image, Title } from "@mantine/core";
import React from "react";

export default function AppLogo() {
  return (
    <Group gap="xs">
      <Image src="/gmt_logo.png" alt="ProofKit" width={32} height={32} />
      <Title visibleFrom="sm" order={2} c={"brand"}>
        Global Marine Transportation
      </Title>
      <Title hiddenFrom="sm" order={2} c={"brand"}>
        GMT
      </Title>
    </Group>
  );
}
